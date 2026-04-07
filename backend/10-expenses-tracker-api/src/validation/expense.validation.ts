import { categories } from '@/db/schema/expenses.js';
import z from 'zod';

export const idSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

type ExpenseBody = {
  description: string;
  amount: number;
  category: (typeof categories)[number];
  date?: string | undefined;
};

const expenseBody = z.strictObject({
  description: z.string().min(1).max(255),
  amount: z.coerce.number().positive(),
  category: z.enum(categories),
  date: z.iso.date().optional(),
}) satisfies z.ZodType<ExpenseBody>;

export const createExpenseSchema = z.object({
  body: expenseBody,
});

export const updateExpenseSchema = z.object({
  ...idSchema.shape,
  body: expenseBody.partial(),
});

export const filterExpenseSchema = z.object({
  query: z
    .object({
      filter: z
        .enum(['past_week', 'past_month', 'last_3_months', 'custom'])
        .optional(),
      start_date: z.iso.date().optional(),
      end_date: z.iso.date().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.filter === 'custom') {
        if (!data.start_date) {
          ctx.issues.push({
            code: 'custom',
            input: data.start_date,
            message: 'start_date is required for custom filter',
            path: ['start_date'],
          });
        }
        if (!data.end_date) {
          ctx.issues.push({
            code: 'custom',
            input: data.end_date,
            message: 'end_date is required for custom filter',
            path: ['end_date'],
          });
        }
      }
    }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>['body'];
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>['body'];
export type FilterExpenseQuery = z.infer<typeof filterExpenseSchema>['query'];
