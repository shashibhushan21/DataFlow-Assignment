import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Shashi@123@localhost:5432/mydatabase",
});

export const db = drizzle(pool, { schema });
