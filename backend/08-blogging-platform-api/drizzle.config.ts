import { DATABASE_URL } from './src/config/env.ts';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
