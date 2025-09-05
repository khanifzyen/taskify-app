import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Perbaikan: Instal 'postgres' library sebagai pengganti 'pg' untuk client
// Jalankan: pnpm add postgres

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Untuk query client
const client = postgres(connectionString);
export const db = drizzle(client);