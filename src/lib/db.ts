import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Log para depurar en Netlify
console.log('DATABASE_URL exists:', !!connectionString);
console.log('DATABASE_URL length:', connectionString?.length || 0);

let pool: Pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: true,
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
