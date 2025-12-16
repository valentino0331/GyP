import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  validateContactForm, 
  validateEmail, 
  validatePhone, 
  validateDate,
  type ContactFormData 
} from '@/lib/validations';

// Interfaz para mensajes de contacto almacenados
interface ContactMessage {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  asunto: string;
  mensaje: string;
  created_at: Date;
}

// POST /api/contact - Enviar mensaje de contacto
export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // ==================== VALIDACIONES BACKEND ====================
    
    // 1. Validar todos los campos usando la librería compartida
    const validation = validateContactForm(body);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Datos de formulario inválidos',
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // 2. Validaciones adicionales de seguridad en backend
    
    // Sanitizar datos
    const sanitizedData = {
      nombre: body.nombre.trim().slice(0, 100),
      empresa: body.empresa.trim().slice(0, 100),
      email: body.email.trim().toLowerCase().slice(0, 255),
      telefono: body.telefono.replace(/\D/g, '').slice(0, 9),
      fechaNacimiento: body.fechaNacimiento.trim(),
      asunto: body.asunto.trim().slice(0, 200),
      mensaje: body.mensaje.trim().slice(0, 1000)
    };

    // 3. Validar formato de fecha en backend (doble verificación)
    const dateResult = validateDate(sanitizedData.fechaNacimiento);
    if (!dateResult.isValid) {
      return NextResponse.json(
        { 
          error: dateResult.error,
          errors: { fechaNacimiento: dateResult.error }
        },
        { status: 400 }
      );
    }

    // 4. Validar formato de teléfono (doble verificación - 9 dígitos exactos)
    const phoneResult = validatePhone(sanitizedData.telefono);
    if (!phoneResult.isValid) {
      return NextResponse.json(
        { 
          error: phoneResult.error,
          errors: { telefono: phoneResult.error }
        },
        { status: 400 }
      );
    }

    // 5. Validar formato de email (doble verificación)
    const emailResult = validateEmail(sanitizedData.email);
    if (!emailResult.isValid) {
      return NextResponse.json(
        { 
          error: emailResult.error,
          errors: { email: emailResult.error }
        },
        { status: 400 }
      );
    }

    // ==================== VERIFICACIÓN DE DUPLICADOS ====================
    
    // 6. Verificar duplicados por email + asunto en las últimas 24 horas
    const duplicateCheck = await db.query(
      `SELECT id FROM contact_messages 
       WHERE email = $1 
       AND asunto = $2 
       AND created_at > NOW() - INTERVAL '24 hours'`,
      [sanitizedData.email, sanitizedData.asunto]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { 
          error: 'Ya has enviado un mensaje con este asunto recientemente. Por favor espera 24 horas.',
          errors: { asunto: 'Mensaje duplicado detectado' }
        },
        { status: 409 } // Conflict
      );
    }

    // 7. Verificar rate limiting: máximo 5 mensajes por email en 24 horas
    const rateLimitCheck = await db.query(
      `SELECT COUNT(*) as count FROM contact_messages 
       WHERE email = $1 
       AND created_at > NOW() - INTERVAL '24 hours'`,
      [sanitizedData.email]
    );

    if (parseInt(rateLimitCheck.rows[0].count) >= 5) {
      return NextResponse.json(
        { 
          error: 'Has alcanzado el límite de mensajes diarios. Intenta nuevamente mañana.',
          errors: { email: 'Límite de mensajes alcanzado' }
        },
        { status: 429 } // Too Many Requests
      );
    }

    // 8. Verificar duplicado exacto por contenido del mensaje
    const contentDuplicateCheck = await db.query(
      `SELECT id FROM contact_messages 
       WHERE email = $1 
       AND mensaje = $2 
       AND created_at > NOW() - INTERVAL '1 hour'`,
      [sanitizedData.email, sanitizedData.mensaje]
    );

    if (contentDuplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { 
          error: 'Este mensaje ya fue enviado recientemente.',
          errors: { mensaje: 'Mensaje duplicado' }
        },
        { status: 409 }
      );
    }

    // ==================== GUARDAR EN BASE DE DATOS ====================

    // Convertir fecha dd/mm/yyyy a formato ISO para PostgreSQL
    const [day, month, year] = sanitizedData.fechaNacimiento.split('/');
    const fechaISO = `${year}-${month}-${day}`;

    const result = await db.query(
      `INSERT INTO contact_messages 
       (nombre, empresa, email, telefono, fecha_nacimiento, asunto, mensaje) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, created_at`,
      [
        sanitizedData.nombre,
        sanitizedData.empresa,
        sanitizedData.email,
        sanitizedData.telefono,
        fechaISO,
        sanitizedData.asunto,
        sanitizedData.mensaje
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      id: result.rows[0].id,
      timestamp: result.rows[0].created_at
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error al procesar mensaje de contacto:', error);
    
    // Manejar error de tabla no existente
    if (error.code === '42P01') {
      return NextResponse.json(
        { 
          error: 'Sistema en mantenimiento. Intente más tarde.',
          details: 'La tabla de mensajes no existe'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor, intente más tarde.' },
      { status: 500 }
    );
  }
}

// GET /api/contact - Obtener mensajes (solo admin)
export async function GET(request: NextRequest) {
  try {
    // Aquí se debería agregar autenticación de admin
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await db.query(
      `SELECT * FROM contact_messages 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [Math.min(limit, 100), offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM contact_messages');

    return NextResponse.json({
      messages: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });

  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}
