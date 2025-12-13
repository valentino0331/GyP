const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function updatePassword() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_8EA1PjMmHltS@ep-wandering-sunset-ah41pdab-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
    ssl: true
  });

  try {
    // Generar hash
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('New hash:', hash);
    
    // Actualizar en DB
    const result = await pool.query(
      'UPDATE app_users SET password_hash = $1 WHERE email = $2',
      [hash, 'admin@gypconsultoria.com']
    );
    console.log('Rows updated:', result.rowCount);
    
    // Verificar
    const check = await pool.query(
      'SELECT email, password_hash FROM app_users WHERE email = $1',
      ['admin@gypconsultoria.com']
    );
    console.log('Verified:', check.rows[0]);
    
    // Probar comparación
    const isValid = await bcrypt.compare(password, check.rows[0].password_hash);
    console.log('Password comparison:', isValid);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

updatePassword();
