import { Pool } from 'pg';

// Priorizar DATABASE_URL manual sobre NETLIFY_DATABASE_URL automático
const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

// Log para depurar en Netlify
console.log('Using DATABASE_URL:', !!process.env.DATABASE_URL);
console.log('Using NETLIFY_DATABASE_URL:', !!process.env.NETLIFY_DATABASE_URL);
console.log('Connection string length:', connectionString?.length || 0);

// Mostrar las primeras partes de la URL para debug (sin mostrar password)
if (connectionString) {
  try {
    const url = new URL(connectionString);
    console.log('DB Host:', url.hostname);
    console.log('DB Port:', url.port || '5432');
    console.log('DB Name:', url.pathname);
  } catch (e) {
    console.log('Error parsing URL:', e);
    console.log('URL starts with:', connectionString.substring(0, 50));
  }
}

let pool: Pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
  });
  console.log('Pool de base de datos creado correctamente');
} else {
  console.error('ERROR: DATABASE_URL no está definida');
  pool = new Pool({ connectionString: 'postgresql://localhost:5432/test' });
}

export const db = {
  query: async (text: string, params?: any[]) => {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Error en query:', error);
      throw error;
    }
  },
};
