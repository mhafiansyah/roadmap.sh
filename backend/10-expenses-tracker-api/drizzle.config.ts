import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from '../09-todo-list-api/src/config/env';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/db/schema/*',

  dbCredentials: {
    url: DATABASE_URL,
  },
});
