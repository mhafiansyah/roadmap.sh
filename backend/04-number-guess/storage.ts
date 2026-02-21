import fs from 'node:fs/promises'
import type { Leaderboard, PlayerScore, DifficultyLevel } from './types.js';

// const FILE_PATH = new URL ('./leaderboard.json', import.meta.url);
const FILE_PATH = './leaderboard.json';
const EMPTY_LEADERBOARD: Leaderboard = { 1: [], 2: [], 3: [] };

export const loadLeaderboard = async(): Promise<Leaderboard> => {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        // if file doesnt exist or invalid, return empty structure
        return EMPTY_LEADERBOARD;
    }
};

export const saveScore = async (
    level: DifficultyLevel,
    score: PlayerScore
): Promise<void> => {
    const board = await loadLeaderboard();

    // add a new score, sort by attemps (ascending), and keep top 5
    const updatedList = [...board[level], score]
        .sort((a, b) => a.attemptsUsed - b.attemptsUsed)
        .slice(0, 5);

    const updatedBoard = { ...board, [level]: updatedList };
    await fs.writeFile(FILE_PATH, JSON.stringify(updatedBoard, null, 2));

    console.log('\n--- TOP 5 RANKING ---');
    updatedList.forEach((s, i) => {
        console.log(`${i + 1}. ${s.name} - ${s.attemptsUsed} tries (${s.date})`);
    });
};