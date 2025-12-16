import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/services - Obtener todos los servicios
export async function GET() {
  try {
    const result = await db.query(
      `SELECT id, title, description, icon, features, display_order, is_visible, created_at 
       FROM services 
       ORDER BY display_order ASC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/services - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, icon, features } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Título y descripción son requeridos' }, { status: 400 });
    }

    // Obtener el siguiente orden
    const orderResult = await db.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM services');
    const nextOrder = orderResult.rows[0].next_order;

    const result = await db.query(
      `INSERT INTO services (title, description, icon, features, display_order) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, description, icon || 'chart', features || '[]', nextOrder]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}

// PUT /api/services - Actualizar servicio
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, icon, features, is_visible, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE services 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           icon = COALESCE($3, icon),
           features = COALESCE($4, features),
           is_visible = COALESCE($5, is_visible),
           display_order = COALESCE($6, display_order)
       WHERE id = $7 
       RETURNING *`,
      [title, description, icon, features, is_visible, display_order, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// DELETE /api/services?id=X - Eliminar servicio
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await db.query('DELETE FROM services WHERE id = $1', [id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
