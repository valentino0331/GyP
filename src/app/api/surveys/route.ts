import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/surveys - Obtener todas las encuestas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const includeQuestions = searchParams.get('includeQuestions') === 'true';

    let query = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.is_active,
        s.created_at,
        u.name as created_by_name,
        (SELECT COUNT(*) FROM submissions sub WHERE sub.survey_id = s.id) as response_count
      FROM surveys s
      LEFT JOIN app_users u ON s.created_by = u.id
    `;

    if (activeOnly) {
      query += ' WHERE s.is_active = true';
    }

    query += ' ORDER BY s.created_at DESC';

    const result = await db.query(query);
    
    let surveys = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.created_at,
      createdByName: row.created_by_name,
      responseCount: parseInt(row.response_count) || 0,
    }));

    // Si se piden las preguntas, las agregamos
    if (includeQuestions) {
      for (const survey of surveys) {
        const questionsResult = await db.query(
          `SELECT id, text, type, display_order 
           FROM questions 
           WHERE survey_id = $1 
           ORDER BY display_order`,
          [survey.id]
        );

        const questions = [];
        for (const q of questionsResult.rows) {
          const optionsResult = await db.query(
            `SELECT id, text, display_order 
             FROM question_options 
             WHERE question_id = $1 
             ORDER BY display_order`,
            [q.id]
          );

          questions.push({
            id: q.id,
            text: q.text,
            type: q.type,
            displayOrder: q.display_order,
            options: optionsResult.rows.map(o => ({
              id: o.id,
              text: o.text,
              displayOrder: o.display_order,
            })),
          });
        }

        (survey as any).questions = questions;
      }
    }

    return NextResponse.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { error: 'Error al obtener las encuestas' },
      { status: 500 }
    );
  }
}

// POST /api/surveys - Crear nueva encuesta
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, questions, isActive = false } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      );
    }

    // Obtener el ID del usuario
    const userResult = await db.query(
      'SELECT id FROM app_users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;

    // Crear la encuesta
    const surveyResult = await db.query(
      `INSERT INTO surveys (title, description, created_by, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, is_active, created_at`,
      [title, description || null, userId, isActive]
    );

    const survey = surveyResult.rows[0];

    // Si hay preguntas, las creamos
    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        const questionResult = await db.query(
          `INSERT INTO questions (survey_id, text, type, display_order)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [survey.id, q.text, q.type, i + 1]
        );

        const questionId = questionResult.rows[0].id;

        // Si la pregunta tiene opciones, las creamos
        if (q.options && Array.isArray(q.options)) {
          for (let j = 0; j < q.options.length; j++) {
            await db.query(
              `INSERT INTO question_options (question_id, text, display_order)
               VALUES ($1, $2, $3)`,
              [questionId, q.options[j].text || q.options[j], j + 1]
            );
          }
        }
      }
    }

    return NextResponse.json({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      isActive: survey.is_active,
      createdAt: survey.created_at,
      message: 'Encuesta creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json(
      { error: 'Error al crear la encuesta' },
      { status: 500 }
    );
  }
}
