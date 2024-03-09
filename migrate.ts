import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';

const migrationsclient = postgres(process.env.DB_URL!, {
  max: 1,
});
const db = drizzle(migrationsclient);
migrate(db, { migrationsFolder: './migrations-folder' });
