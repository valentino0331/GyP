import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - Obtener todo el contenido del sitio o una sección específica
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      const result = await db.query(
        'SELECT * FROM site_content WHERE section_key = $1',
        [section]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 });
      }
      
      return NextResponse.json(result.rows[0]);
    }

    const result = await db.query(
      'SELECT * FROM site_content ORDER BY section_key'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar contenido de una sección (solo admin)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo admin puede editar contenido del sitio
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Solo el administrador puede editar el contenido' }, { status: 403 });
    }

    const body = await request.json();
    const { section_key, section_name, content } = body;

    if (!section_key || !content) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Upsert - actualizar o insertar
    const result = await db.query(
      `INSERT INTO site_content (section_key, section_name, content, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (section_key) 
       DO UPDATE SET 
         section_name = COALESCE($2, site_content.section_name),
         content = $3,
         updated_by = $4,
         updated_at = NOW()
       RETURNING *`,
      [section_key, section_name || section_key, JSON.stringify(content), userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Crear nueva sección de contenido (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Solo el administrador puede crear contenido' }, { status: 403 });
    }

    const body = await request.json();
    const { section_key, section_name, content } = body;

    if (!section_key || !section_name) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const result = await db.query(
      `INSERT INTO site_content (section_key, section_name, content, updated_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [section_key, section_name, JSON.stringify(content || {}), userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ya existe una sección con esa clave' }, { status: 409 });
    }
    console.error('Error al crear contenido:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
