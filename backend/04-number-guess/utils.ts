import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const rl = readline.createInterface({ input, output });
export const prompt = async(msg: string): Promise<string> => {
    try {
        return await rl.question(msg);
    } catch {
        throw new Error("IO interface failure");
    }
};

export const getRandom = (max: number): number => Math.floor(Math.random() * max) + 1;