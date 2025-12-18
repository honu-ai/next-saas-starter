import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Allow running without database in static mode
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (process.env.POSTGRES_URL) {
  client = postgres(process.env.POSTGRES_URL);
  dbInstance = drizzle(client, { schema });
}

export { client };
export const db = dbInstance as ReturnType<typeof drizzle>;
