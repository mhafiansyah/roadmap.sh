import { db } from '@/db/db.js';
import { expenseTable, type InsertExpense } from '@/db/schema/expenses.js';
import type { ValidatedResponse } from '@/types/api.types.js';
import * as v from '@/validation/expense.validation.js';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import type { Request } from 'express';

type CreateExpenseValues = Omit<
  InsertExpense,
  'id' | 'createdAt' | 'updatedAt'
>;

type CreateExpenseValuesWithoutDate = Omit<CreateExpenseValues, 'date'>;

type UpdateExpenseValues = Partial<
  Omit<InsertExpense, 'id' | 'userId' | 'createdAt'>
>;

const toCreateExpenseValues = (
  body: v.CreateExpenseInput,
  userId: number,
): CreateExpenseValues => ({
  description: body.description,
  amount: body.amount.toString(),
  category: body.category,
  date: body.date,
  userId,
});

const toUpdateExpenseValues = (
  body: v.UpdateExpenseInput,
): UpdateExpenseValues => {
  const values: UpdateExpenseValues = {
    updatedAt: new Date(),
  };

  if (body.description !== undefined) values.description = body.description;
  if (body.amount !== undefined) values.amount = body.amount.toString();
  if (body.category !== undefined) values.category = body.category;
  if (body.date !== undefined) values.date = body.date;

  return values;
};

const getExpenseByIdQuery = db
  .select()
  .from(expenseTable)
  .where(
    and(
      eq(expenseTable.id, sql.placeholder('id')),
      eq(expenseTable.userId, sql.placeholder('userId')),
    ),
  )
  .prepare('get_expense_by_id');

const createExpenseQuery = db
  .insert(expenseTable)
  .values({
    description: sql.placeholder('description'),
    amount: sql.placeholder('amount'),
    category: sql.placeholder('category'),
    date: sql.placeholder('date'),
    userId: sql.placeholder('userId'),
  })
  .returning()
  .prepare('create_expense');

const createExpenseWithoutDateQuery = db
  .insert(expenseTable)
  .values({
    description: sql.placeholder('description'),
    amount: sql.placeholder('amount'),
    category: sql.placeholder('category'),
    userId: sql.placeholder('userId'),
  })
  .returning()
  .prepare('create_expense_without_date');

const updateExpenseQuery = db
  .update(expenseTable)
  .set({
    description: sql`coalesce(${sql.placeholder('description')}, ${expenseTable.description})`,
    amount: sql`coalesce(${sql.placeholder('amount')}, ${expenseTable.amount})`,
    category: sql`coalesce(${sql.placeholder('category')}, ${expenseTable.category})`,
    date: sql`coalesce(${sql.placeholder('date')}, ${expenseTable.date})`,
    updatedAt: sql`${sql.placeholder('updatedAt')}`,
  })
  .where(
    and(
      eq(expenseTable.id, sql.placeholder('id')),
      eq(expenseTable.userId, sql.placeholder('userId')),
    ),
  )
  .returning()
  .prepare('update_expense');

const deleteExpenseQuery = db
  .delete(expenseTable)
  .where(
    and(
      eq(expenseTable.id, sql.placeholder('id')),
      eq(expenseTable.userId, sql.placeholder('userId')),
    ),
  )
  .returning()
  .prepare('delete_expense');

export const getAllExpenses = async (
  req: Request,
  res: ValidatedResponse<typeof v.filterExpenseSchema>,
) => {
  try {
    const userId = Number(req.user?.sub);
    const { filter, start_date, end_date } = res.locals.validated.query;

    let startDate: Date | undefined;
    let endDate: Date | undefined = new Date();

    if (filter === 'past_week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === 'past_month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (filter === 'last_3_months') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (filter === 'custom' && start_date && end_date) {
      startDate = new Date(start_date);
      endDate = new Date(end_date);
    }

    const filters = [eq(expenseTable.userId, userId)];

    if (startDate) {
      const dateStr = startDate.toISOString().split('T')[0];
      if (dateStr) filters.push(gte(expenseTable.date, dateStr));
    }
    if (endDate) {
      const dateStr = endDate.toISOString().split('T')[0];
      if (dateStr) filters.push(lte(expenseTable.date, dateStr));
    }

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(and(...filters));

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

export const getExpenseById = async (
  req: Request,
  res: ValidatedResponse<typeof v.idSchema>,
) => {
  try {
    const userId = Number(req.user?.sub);
    const { id } = res.locals.validated.params;

    const [expense] = await getExpenseByIdQuery.execute({ id, userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense' });
  }
};

export const createExpense = async (
  req: Request,
  res: ValidatedResponse<typeof v.createExpenseSchema>,
) => {
  try {
    const userId = Number(req.user?.sub);
    const { body } = res.locals.validated;

    const values = toCreateExpenseValues(body, userId);
    const [newExpense] =
      values.date === undefined
        ? await createExpenseWithoutDateQuery.execute(
            values satisfies CreateExpenseValuesWithoutDate,
          )
        : await createExpenseQuery.execute(values);

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense' });
  }
};

export const updateExpense = async (
  req: Request,
  res: ValidatedResponse<typeof v.updateExpenseSchema>,
) => {
  try {
    const userId = Number(req.user?.sub);
    const { params, body } = res.locals.validated;

    const values = toUpdateExpenseValues(body);

    const [updatedExpense] = await updateExpenseQuery.execute({
      id: params.id,
      userId,
      description: values.description,
      amount: values.amount,
      category: values.category,
      date: values.date,
      updatedAt: values.updatedAt,
    });

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense' });
  }
};

export const deleteExpense = async (
  req: Request,
  res: ValidatedResponse<typeof v.idSchema>,
) => {
  try {
    const userId = Number(req.user?.sub);
    const { id } = res.locals.validated.params;

    const [deletedExpense] = await deleteExpenseQuery.execute({ id, userId });

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
};
