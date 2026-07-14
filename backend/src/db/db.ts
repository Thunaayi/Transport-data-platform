import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5433/transport';

// Supabase requires SSL for hosted PostgreSQL. We enable it for remote connections
// (any host that isn't localhost) and keep it off for local dev.
const isRemote = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString,
  ...(isRemote && {
    ssl: { rejectUnauthorized: false },
  }),
});

export const db = drizzle(pool, { schema });
