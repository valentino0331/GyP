import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink, stat } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  // @ts-ignore
  const userId = session.user.id;

  try {
    const { displayName, fileName, originalName, filePath, fileType, fileSize } = await request.json();

    if (!displayName || !fileName || !originalName || !filePath || !fileType || !fileSize) {
      return NextResponse.json({ error: 'Faltan datos del archivo' }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO downloadable_files (display_name, file_name, original_name, file_path, file_type, file_size, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, display_name, file_path, file_type, file_size, created_at`,
      [displayName, fileName, originalName, filePath, fileType, fileSize, userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating downloadable file record:', error);
    return NextResponse.json({ error: 'Error al crear el registro del archivo' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const files = await db.query('SELECT id, display_name, file_path, file_type, file_size, created_at FROM downloadable_files ORDER BY created_at DESC');
    return NextResponse.json(files.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching downloadable files:', error);
    return NextResponse.json({ error: 'Error al obtener los archivos' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Falta el ID del archivo' }, { status: 400 });
  }

  try {
    // 1. Obtener la información del archivo de la base de datos
    const fileResult = await db.query('SELECT file_path FROM downloadable_files WHERE id = $1', [id]);
    if (fileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }
    const { file_path } = fileResult.rows[0];

    // 2. Eliminar el archivo del sistema de archivos
    const fullPath = path.join(process.cwd(), 'public', file_path);
    try {
      await stat(fullPath); // Verificar si el archivo existe
      await unlink(fullPath);
    } catch (fsError: any) {
      // Si el archivo no existe, no es un error fatal, podemos continuar para borrar el registro de la BD
      if (fsError.code !== 'ENOENT') {
        throw fsError; // Lanzar otros errores del sistema de archivos
      }
      console.warn(`File not found at path: ${fullPath}, proceeding to delete DB record.`);
    }

    // 3. Eliminar el registro de la base de datos
    await db.query('DELETE FROM downloadable_files WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Archivo eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error al eliminar el archivo' }, { status: 500 });
  }
}
