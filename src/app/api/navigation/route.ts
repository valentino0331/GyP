import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - Obtener enlaces de navegación
export async function GET() {
  try {
    const result = await db.query(
      'SELECT * FROM navigation_links WHERE is_visible = true ORDER BY display_order ASC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener navegación:', error);
    // Si la tabla no existe, devolver navegación por defecto
    return NextResponse.json([
      { id: '1', label: 'Servicios', href: '/servicios', display_order: 1 },
      { id: '2', label: 'Estudios', href: '/estudios', display_order: 2 },
      { id: '3', label: 'Nosotros', href: '/nosotros', display_order: 3 },
      { id: '4', label: 'Clientes', href: '/clientes', display_order: 4 },
      { id: '5', label: 'Contacto', href: '/contacto', display_order: 5 },
    ]);
  }
}

// PUT - Actualizar todos los enlaces de navegación (solo admin)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Solo el administrador puede editar la navegación' }, { status: 403 });
    }

    const body = await request.json();
    const { links } = body;

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Eliminar todos los enlaces existentes y crear nuevos
    await db.query('DELETE FROM navigation_links');

    for (const link of links) {
      await db.query(
        `INSERT INTO navigation_links (label, href, display_order, is_visible)
         VALUES ($1, $2, $3, $4)`,
        [link.label, link.href, link.display_order, link.is_visible !== false]
      );
    }

    const result = await db.query(
      'SELECT * FROM navigation_links ORDER BY display_order ASC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al actualizar navegación:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
