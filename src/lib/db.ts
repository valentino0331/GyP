import { Pool } from 'pg';

// Next.js carga automáticamente las variables de .env.local
let pool: Pool;

const connectionString = process.env.DATABASE_URL;

if (connectionString) {
  pool = new Pool({
    connectionString,
    // En producción, podrías necesitar configuración SSL
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  });

  console.log('Conexión a la base de datos configurada.');
} else {
  console.error("La variable de entorno DATABASE_URL no está definida.");
  // Creamos un pool vacío para evitar que la aplicación crashee al importar,
  // pero mostraremos un error claro.
  pool = new Pool();
}

export const db = pool;
