import { db } from '@/db/db.js';
import { expenseTable } from '@/db/schema/expenses.js';
import type { ValidatedResponse } from '@/types/api.types.js';
import * as v from '@/validation/expense.validation.js';
import { and, eq, gte, lte } from 'drizzle-orm';
import type { Request } from 'express';

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

    const [expense] = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.id, id), eq(expenseTable.userId, userId)));

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

    const [newExpense] = await db
      .insert(expenseTable)
      .values({
        ...body,
        amount: body.amount.toString(),
        userId,
      })
      .returning();

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

    const [updatedExpense] = await db
      .update(expenseTable)
      .set({
        ...body,
        amount: body.amount ? body.amount.toString() : undefined, // Convert if present
        updatedAt: new Date(),
      })
      .where(
        and(eq(expenseTable.id, params.id), eq(expenseTable.userId, userId)),
      )
      .returning();

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

    const [deletedExpense] = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.id, id), eq(expenseTable.userId, userId)))
      .returning();

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
};
