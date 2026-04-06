import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import { usersTable } from './users.js';

export const categories = [
  'Groceries',
  'Leisure',
  'Electronics',
  'Utilities',
  'Clothing',
  'Health',
  'Others',
] as const;

export const categoryEnum = pgEnum('expense_category', categories);

export const expenseTable = table('expenses', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  description: t.text().notNull(),
  amount: t.numeric({ precision: 12, scale: 2 }).notNull(),
  category: categoryEnum().notNull(),
  date: t.date().defaultNow().notNull(),
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
  updatedAt: t.timestamp('updated_at').defaultNow().notNull(),
});

export type SelectExpense = InferSelectModel<typeof expenseTable>;
export type InsertExpense = InferInsertModel<typeof expenseTable>;
