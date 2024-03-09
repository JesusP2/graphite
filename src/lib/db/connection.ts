import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { envs } from "../env-vars";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: envs.DB_URL,
});
export const db = drizzle(pool, { schema });
export type DBSchema = typeof schema;
