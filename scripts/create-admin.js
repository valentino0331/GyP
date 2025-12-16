// Script para crear el usuario admin en la base de datos
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/encuestas'
});

async function createAdmin() {
  try {
    // Primero verificamos si ya existe
    const checkResult = await pool.query(
      'SELECT id FROM app_users WHERE email = $1',
      ['admin@gypconsultoria.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('El usuario admin ya existe. Actualizando contraseña...');
      
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        'UPDATE app_users SET password_hash = $1 WHERE email = $2',
        [hash, 'admin@gypconsultoria.com']
      );
      
      console.log('✅ Contraseña actualizada!');
    } else {
      console.log('Creando usuario admin...');
      
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO app_users (name, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
        ['Administrador', 'admin@gypconsultoria.com', hash, 'admin']
      );
      
      console.log('✅ Usuario admin creado!');
    }

    console.log('\n📧 Email: admin@gypconsultoria.com');
    console.log('🔑 Contraseña: admin123');
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message.includes('relation "app_users" does not exist')) {
      console.log('\n⚠️  La tabla app_users no existe. Ejecutando schema...');
      
      // Crear las tablas
      await pool.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        CREATE TABLE IF NOT EXISTS app_users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS surveys (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          created_by UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          is_active BOOLEAN NOT NULL DEFAULT false
        );
        
        DO $$ BEGIN
          CREATE TYPE question_type AS ENUM ('text', 'single_choice', 'multiple_choice');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
        
        CREATE TABLE IF NOT EXISTS questions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
          text TEXT NOT NULL,
          type question_type NOT NULL,
          display_order INT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS question_options (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
          text VARCHAR(255) NOT NULL,
          display_order INT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS answers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
          question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
          text_value TEXT,
          selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL
        );
      `);
      
      console.log('✅ Tablas creadas!');
      
      // Ahora crear el admin
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO app_users (name, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
        ['Administrador', 'admin@gypconsultoria.com', hash, 'admin']
      );
      
      console.log('✅ Usuario admin creado!');
      console.log('\n📧 Email: admin@gypconsultoria.com');
      console.log('🔑 Contraseña: admin123');
    }
  } finally {
    await pool.end();
  }
}

createAdmin();
