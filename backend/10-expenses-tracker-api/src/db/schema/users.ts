import type { InferSelectModel } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from 'drizzle-orm/pg-core';

export const usersTable = table('users', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  username: t.varchar({ length: 255 }).notNull().unique(),
  password: t.text().notNull(),
  name: t.varchar({ length: 255 }),
});

export type SelectUser = InferSelectModel<typeof usersTable>;
