import { DATABASE_URL } from '@/config/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema.js';

export const db = drizzle(DATABASE_URL, { schema });
