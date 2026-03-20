import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { pgTable, varchar, integer, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
});

export type SelectUser = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;

export const todosTable = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  userId: integer().notNull(),
});

export type SelectTodo = InferSelectModel<typeof todosTable>;
export type InsertTodo = InferInsertModel<typeof todosTable>;

export const usersRelations = relations(usersTable, ({ many }) => ({
  todos: many(todosTable),
}));

export const todosRelations = relations(todosTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [todosTable.userId],
    references: [usersTable.id],
  }),
}));
