import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configurar WebSocket para entornos serverless (Netlify)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

let pool: Pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
  });
  console.log('Conexión a la base de datos configurada.');
} else {
  console.error("La variable de entorno DATABASE_URL no está definida.");
  pool = new Pool({ connectionString: '' });
}

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
