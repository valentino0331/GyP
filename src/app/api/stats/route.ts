import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/stats - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Encuestas activas
    const activeSurveysResult = await db.query(
      'SELECT COUNT(*) FROM surveys WHERE is_active = true'
    );
    const activeSurveys = parseInt(activeSurveysResult.rows[0].count) || 0;

    // Total de encuestas
    const totalSurveysResult = await db.query(
      'SELECT COUNT(*) FROM surveys'
    );
    const totalSurveys = parseInt(totalSurveysResult.rows[0].count) || 0;

    // Respuestas hoy
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const responsesTodayResult = await db.query(
      'SELECT COUNT(*) FROM submissions WHERE submitted_at >= $1',
      [todayStart.toISOString()]
    );
    const responsesToday = parseInt(responsesTodayResult.rows[0].count) || 0;

    // Total de respuestas
    const totalResponsesResult = await db.query(
      'SELECT COUNT(*) FROM submissions'
    );
    const totalResponses = parseInt(totalResponsesResult.rows[0].count) || 0;

    // Usuarios registrados
    const totalUsersResult = await db.query(
      'SELECT COUNT(*) FROM app_users'
    );
    const totalUsers = parseInt(totalUsersResult.rows[0].count) || 0;

    // Respuestas por día (últimos 7 días)
    const responsesByDayResult = await db.query(`
      SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as count
      FROM submissions
      WHERE submitted_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(submitted_at)
      ORDER BY date ASC
    `);

    const responsesByDay = responsesByDayResult.rows.map(r => ({
      date: r.date,
      count: parseInt(r.count) || 0,
    }));

    // Encuestas recientes con conteo de respuestas
    const recentSurveysResult = await db.query(`
      SELECT 
        s.id,
        s.title,
        s.is_active,
        s.created_at,
        (SELECT COUNT(*) FROM submissions sub WHERE sub.survey_id = s.id) as response_count
      FROM surveys s
      ORDER BY s.created_at DESC
      LIMIT 5
    `);

    const recentSurveys = recentSurveysResult.rows.map(s => ({
      id: s.id,
      title: s.title,
      isActive: s.is_active,
      createdAt: s.created_at,
      responseCount: parseInt(s.response_count) || 0,
    }));

    // Actividad reciente (últimas 10 acciones)
    const recentActivityResult = await db.query(`
      SELECT 
        'response' as type,
        s.title as survey_title,
        sub.submitted_at as timestamp
      FROM submissions sub
      JOIN surveys s ON sub.survey_id = s.id
      ORDER BY sub.submitted_at DESC
      LIMIT 10
    `);

    const recentActivity = recentActivityResult.rows.map(a => ({
      type: a.type,
      surveyTitle: a.survey_title,
      timestamp: a.timestamp,
    }));

    // Tasa de respuesta (si hay encuestas activas)
    let responseRate = 0;
    if (activeSurveys > 0) {
      // Calcular basado en respuestas de los últimos 7 días
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weekResponsesResult = await db.query(
        'SELECT COUNT(*) FROM submissions WHERE submitted_at >= $1',
        [weekAgo.toISOString()]
      );
      const weekResponses = parseInt(weekResponsesResult.rows[0].count) || 0;
      
      // Respuestas por encuesta activa por día (promedio)
      responseRate = Math.round((weekResponses / (activeSurveys * 7)) * 100);
      if (responseRate > 100) responseRate = 100;
    }

    return NextResponse.json({
      stats: {
        activeSurveys,
        totalSurveys,
        responsesToday,
        totalResponses,
        totalUsers,
        responseRate: `${responseRate}%`,
      },
      responsesByDay,
      recentSurveys,
      recentActivity,
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
