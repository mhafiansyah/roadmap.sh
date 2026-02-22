export interface Expense {
    desc: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export type ExpenseRecord = Record<string, Expense>;