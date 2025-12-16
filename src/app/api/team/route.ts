import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/team - Obtener todos los miembros del equipo
export async function GET() {
  try {
    const result = await db.query(
      `SELECT id, name, position, bio, photo_url, display_order, is_visible, created_at 
       FROM team_members 
       ORDER BY display_order ASC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/team - Crear nuevo miembro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, bio, photo_url } = body;

    if (!name || !position) {
      return NextResponse.json({ error: 'Nombre y cargo son requeridos' }, { status: 400 });
    }

    // Obtener el siguiente orden
    const orderResult = await db.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM team_members');
    const nextOrder = orderResult.rows[0].next_order;

    const result = await db.query(
      `INSERT INTO team_members (name, position, bio, photo_url, display_order) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, position, bio || '', photo_url || '', nextOrder]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Error al crear miembro:', error);
    return NextResponse.json({ error: 'Error al crear miembro' }, { status: 500 });
  }
}

// PUT /api/team - Actualizar miembro
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, position, bio, photo_url, is_visible, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE team_members 
       SET name = COALESCE($1, name),
           position = COALESCE($2, position),
           bio = COALESCE($3, bio),
           photo_url = COALESCE($4, photo_url),
           is_visible = COALESCE($5, is_visible),
           display_order = COALESCE($6, display_order)
       WHERE id = $7 
       RETURNING *`,
      [name, position, bio, photo_url, is_visible, display_order, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error al actualizar miembro:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// DELETE /api/team?id=X - Eliminar miembro
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await db.query('DELETE FROM team_members WHERE id = $1', [id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error al eliminar miembro:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
