import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - Obtener galería de trabajos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visibleOnly = searchParams.get('visible') === 'true';

    let query = 'SELECT * FROM work_gallery';
    if (visibleOnly) {
      query += ' WHERE is_visible = true';
    }
    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await db.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener galería:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Agregar imagen a la galería (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Solo el administrador puede agregar imágenes' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, image_url, display_order } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Título e imagen son requeridos' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const result = await db.query(
      `INSERT INTO work_gallery (title, description, image_url, display_order, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description || '', image_url, display_order || 0, userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al agregar imagen:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar imagen de galería
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Solo el administrador puede editar' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, image_url, display_order, is_visible } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE work_gallery 
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           display_order = COALESCE($5, display_order),
           is_visible = COALESCE($6, is_visible)
       WHERE id = $1
       RETURNING *`,
      [id, title, description, image_url, display_order, is_visible]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar imagen de galería
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Solo el administrador puede eliminar' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await db.query(
      'DELETE FROM work_gallery WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
