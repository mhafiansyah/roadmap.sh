export type DifficultyLevel = 1 | 2 | 3;
export type GameStatus = 'win' | 'lose' | 'quit';

export interface GameResult {
    status: GameStatus;
    attemptsUsed: number;
}

export interface GameConfig {
    name: string;
    maxNumber: number;
    maxAttempts: number;
}

export interface GameState {
    target: number;
    attemptsLeft: number;
    config: GameConfig;
    prevGuess: number[];
}

export interface PlayerScore {
    name: string;
    attemptsUsed: number;
    date: string;
}

export type Leaderboard = Record<DifficultyLevel, PlayerScore[]>

export const DIFFICULTY_CONFIG: Record<DifficultyLevel, GameConfig> = {
    1: { name: 'Easy', maxNumber: 25, maxAttempts: 10 },
    2: { name: 'Medium', maxNumber: 50, maxAttempts: 7 },
    3: { name: 'Hard', maxNumber: 100, maxAttempts: 5 },
};