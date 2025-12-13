import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    // 1. Verificar variables de entorno
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    };

    // 2. Verificar conexión a DB
    let dbCheck = { connected: false, userExists: false, hashLength: 0 };
    try {
      const result = await db.query('SELECT email, password_hash, role FROM app_users LIMIT 1');
      dbCheck = {
        connected: true,
        userExists: result.rows.length > 0,
        hashLength: result.rows[0]?.password_hash?.length || 0,
      };
    } catch (dbError) {
      console.error('DB Error:', dbError);
    }

    // 3. Probar bcrypt
    const testPassword = 'admin123';
    const testHash = await bcrypt.hash(testPassword, 10);
    const hashWorks = await bcrypt.compare(testPassword, testHash);

    return NextResponse.json({
      env: envCheck,
      database: dbCheck,
      bcrypt: { works: hashWorks },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
