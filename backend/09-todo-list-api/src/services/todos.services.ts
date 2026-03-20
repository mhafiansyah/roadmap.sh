import { db } from '@/db/index.js';
import { todosTable, type InsertTodo } from '@/db/schema.js';
import { and, eq, sql } from 'drizzle-orm';

export const getAllTodos = async (
  userId: number,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const todos = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.userId, userId))
    .limit(limit)
    .offset(offset);

  const [totalAllTodos] = await db
    .select({ count: sql<number>`count(*)` })
    .from(todosTable)
    .where(eq(todosTable.userId, userId));

  const totalItem = Number(totalAllTodos?.count || 0);

  return {
    data: todos,
    page,
    limit,
    totalItem,
    totalPages: Math.ceil(totalItem / limit),
  };
};

export const getTodo = async (todoId: number, userId: number) => {
  const [todo] = await db
    .select()
    .from(todosTable)
    .where(and(eq(todosTable.id, todoId), eq(todosTable.userId, userId)));

  return todo ?? null;
};

export const createTodo = async (data: InsertTodo) => {
  const [todo] = await db.insert(todosTable).values(data).returning();
  return todo;
};

export const updateTodo = async (
  todoId: number,
  userId: number,
  data: Partial<InsertTodo>,
) => {
  const [todo] = await db
    .update(todosTable)
    .set(data)
    .where(and(eq(todosTable.id, todoId), eq(todosTable.userId, userId)))
    .returning();

  return todo ?? null;
};

export const deleteTodo = async (todoId: number, userId: number) => {
  const [todo] = await db
    .delete(todosTable)
    .where(and(eq(todosTable.id, todoId), eq(todosTable.userId, userId)))
    .returning({ id: todosTable.id });

  return todo;
};
