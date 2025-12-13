import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/surveys/[id]/respond - Responder una encuesta
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { answers, participantName } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Las respuestas son requeridas' },
        { status: 400 }
      );
    }

    if (!participantName || typeof participantName !== 'string' || !participantName.trim()) {
      return NextResponse.json(
        { error: 'El nombre del participante es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la encuesta existe y está activa
    const surveyResult = await db.query(
      'SELECT id, is_active FROM surveys WHERE id = $1',
      [id]
    );

    if (surveyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Encuesta no encontrada' },
        { status: 404 }
      );
    }

    if (!surveyResult.rows[0].is_active) {
      return NextResponse.json(
        { error: 'Esta encuesta no está activa' },
        { status: 400 }
      );
    }

    // Crear el submission con el nombre del participante
    const submissionResult = await db.query(
      'INSERT INTO submissions (survey_id, participant_name) VALUES ($1, $2) RETURNING id',
      [id, participantName.trim()]
    );

    const submissionId = submissionResult.rows[0].id;

    // Guardar cada respuesta
    for (const answer of answers) {
      const { questionId, textValue, selectedOptionId, selectedOptionIds } = answer;

      if (!questionId) continue;

      // Si es multiple_choice con múltiples opciones
      if (selectedOptionIds && Array.isArray(selectedOptionIds)) {
        for (const optionId of selectedOptionIds) {
          await db.query(
            `INSERT INTO answers (submission_id, question_id, selected_option_id)
             VALUES ($1, $2, $3)`,
            [submissionId, questionId, optionId]
          );
        }
      }
      // Si es single_choice o text
      else {
        await db.query(
          `INSERT INTO answers (submission_id, question_id, text_value, selected_option_id)
           VALUES ($1, $2, $3, $4)`,
          [submissionId, questionId, textValue || null, selectedOptionId || null]
        );
      }
    }

    return NextResponse.json({
      message: 'Respuesta guardada exitosamente',
      submissionId,
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { error: 'Error al guardar la respuesta' },
      { status: 500 }
    );
  }
}

// GET /api/surveys/[id]/respond - Obtener resultados/respuestas de una encuesta
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar que la encuesta existe
    const surveyResult = await db.query(
      'SELECT id, title FROM surveys WHERE id = $1',
      [id]
    );

    if (surveyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Encuesta no encontrada' },
        { status: 404 }
      );
    }

    // Obtener total de respuestas
    const totalResult = await db.query(
      'SELECT COUNT(*) FROM submissions WHERE survey_id = $1',
      [id]
    );
    const totalResponses = parseInt(totalResult.rows[0].count) || 0;

    // Obtener preguntas con estadísticas de respuestas
    const questionsResult = await db.query(
      `SELECT id, text, type, display_order 
       FROM questions 
       WHERE survey_id = $1 
       ORDER BY display_order`,
      [id]
    );

    const questions = [];

    for (const q of questionsResult.rows) {
      const questionData: any = {
        id: q.id,
        text: q.text,
        type: q.type,
        displayOrder: q.display_order,
      };

      if (q.type === 'text') {
        // Para preguntas de texto, obtener las respuestas
        const textAnswersResult = await db.query(
          `SELECT a.text_value, s.submitted_at
           FROM answers a
           JOIN submissions s ON a.submission_id = s.id
           WHERE a.question_id = $1 AND a.text_value IS NOT NULL
           ORDER BY s.submitted_at DESC
           LIMIT 50`,
          [q.id]
        );
        questionData.textResponses = textAnswersResult.rows.map(r => ({
          text: r.text_value,
          submittedAt: r.submitted_at,
        }));
      } else {
        // Para preguntas de opción, obtener estadísticas
        const optionsResult = await db.query(
          `SELECT 
            qo.id,
            qo.text,
            qo.display_order,
            COUNT(a.id) as count
           FROM question_options qo
           LEFT JOIN answers a ON a.selected_option_id = qo.id
           WHERE qo.question_id = $1
           GROUP BY qo.id, qo.text, qo.display_order
           ORDER BY qo.display_order`,
          [q.id]
        );

        questionData.options = optionsResult.rows.map(o => ({
          id: o.id,
          text: o.text,
          displayOrder: o.display_order,
          count: parseInt(o.count) || 0,
          percentage: totalResponses > 0 
            ? Math.round((parseInt(o.count) / totalResponses) * 100) 
            : 0,
        }));
      }

      questions.push(questionData);
    }

    return NextResponse.json({
      surveyId: id,
      surveyTitle: surveyResult.rows[0].title,
      totalResponses,
      questions,
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Error al obtener los resultados' },
      { status: 500 }
    );
  }
}
