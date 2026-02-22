import { randomBytes } from 'node:crypto';
import type { Expense, ExpenseRecord } from './types.js';

export const generateID = (length = 6): string => {
    return randomBytes(length).toString('hex').slice(0, length);
}

export const isInvalidAmount = (amount: any): boolean => {
    return typeof amount !== 'number' || Number.isNaN(amount) || amount < 0;
}

export const formatForTable = (expenses: ExpenseRecord) => {
    return (Object.entries(expenses) as [string, Expense][]).map(([id, data]) => ({
        ID: id,
        Description: data.desc,
        Amount: data.amount,
        CreatedAt: data.createdAt.split('T')[0]
    }));
}

export const filterByMonth = (item: Expense, filter: string): boolean => {
    const monthNames = ["january", "february", "march", "april", "may", "june", 
                        "july", "august", "september", "october", "november", "december"];
    
    const monthNumber = monthNames.includes(filter.toLowerCase())
        ? String(monthNames.indexOf(filter.toLowerCase()) + 1).padStart(2, '0')
        : filter.padStart(2, '0');

    return item.createdAt.slice(5, 7) === monthNumber;
}