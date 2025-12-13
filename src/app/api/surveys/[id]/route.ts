import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/surveys/[id] - Obtener una encuesta por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Obtener la encuesta
    const surveyResult = await db.query(
      `SELECT 
        s.id,
        s.title,
        s.description,
        s.is_active,
        s.created_at,
        u.name as created_by_name
       FROM surveys s
       LEFT JOIN app_users u ON s.created_by = u.id
       WHERE s.id = $1`,
      [id]
    );

    if (surveyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Encuesta no encontrada' },
        { status: 404 }
      );
    }

    const survey = surveyResult.rows[0];

    // Obtener las preguntas
    const questionsResult = await db.query(
      `SELECT id, text, type, display_order 
       FROM questions 
       WHERE survey_id = $1 
       ORDER BY display_order`,
      [id]
    );

    const questions = [];
    for (const q of questionsResult.rows) {
      // Obtener opciones de cada pregunta
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

    // Obtener conteo de respuestas
    const responseCountResult = await db.query(
      'SELECT COUNT(*) FROM submissions WHERE survey_id = $1',
      [id]
    );

    return NextResponse.json({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      isActive: survey.is_active,
      createdAt: survey.created_at,
      createdByName: survey.created_by_name,
      responseCount: parseInt(responseCountResult.rows[0].count) || 0,
      questions,
    });

  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { error: 'Error al obtener la encuesta' },
      { status: 500 }
    );
  }
}

// PUT /api/surveys/[id] - Actualizar una encuesta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, isActive, questions } = body;

    // Verificar que la encuesta existe
    const existingResult = await db.query(
      'SELECT id FROM surveys WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Encuesta no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar la encuesta
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount++}`);
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      updateValues.push(description);
    }
    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount++}`);
      updateValues.push(isActive);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await db.query(
        `UPDATE surveys SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
        updateValues
      );
    }

    // Si se proporcionan preguntas, actualizamos
    if (questions && Array.isArray(questions)) {
      // Eliminar preguntas existentes (cascade eliminará opciones)
      await db.query('DELETE FROM questions WHERE survey_id = $1', [id]);

      // Crear nuevas preguntas
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        const questionResult = await db.query(
          `INSERT INTO questions (survey_id, text, type, display_order)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [id, q.text, q.type, i + 1]
        );

        const questionId = questionResult.rows[0].id;

        if (q.options && Array.isArray(q.options)) {
          for (let j = 0; j < q.options.length; j++) {
            const optionText = typeof q.options[j] === 'string' 
              ? q.options[j] 
              : q.options[j].text;
            
            await db.query(
              `INSERT INTO question_options (question_id, text, display_order)
               VALUES ($1, $2, $3)`,
              [questionId, optionText, j + 1]
            );
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Encuesta actualizada exitosamente',
    });

  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la encuesta' },
      { status: 500 }
    );
  }
}

// DELETE /api/surveys/[id] - Eliminar una encuesta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verificar que existe
    const existingResult = await db.query(
      'SELECT id FROM surveys WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Encuesta no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar (cascade eliminará preguntas, opciones, submissions y answers)
    await db.query('DELETE FROM surveys WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'Encuesta eliminada exitosamente',
    });

  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la encuesta' },
      { status: 500 }
    );
  }
}
