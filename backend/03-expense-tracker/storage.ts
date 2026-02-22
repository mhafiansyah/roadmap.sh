import { readFile, writeFile } from "node:fs/promises"
import type { ExpenseRecord } from "./types.js";

const DB_FILE = new URL ('./expenses.json', import.meta.url);

export const getExpenses = async(): Promise<ExpenseRecord> => {
    try {
        const data = await readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch(err: unknown) {
        return {};
    }
}

export const saveExpenses = async(expenses: ExpenseRecord): Promise<void> => {
    try {
        writeFile(DB_FILE, JSON.stringify(expenses, null, 2));
    } catch (err: unknown) {
        throw new Error('Something went wrong when writing files');
    }
}