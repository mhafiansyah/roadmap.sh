import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type DifficultyLevel = 1 | 2 | 3;

interface GameConfig {
    name: string;
    maxNumber: number;
    maxAttempts: number;
}

interface gameState {
    target: number;
    attemptsLeft: number;
}

const DIFFICULTY_CONFIG: Record<DifficultyLevel, GameConfig> = {
    1: { name: 'Easy', maxNumber: 25, maxAttempts: 10 },
    2: { name: 'Medium', maxNumber: 50, maxAttempts: 7 },
    3: { name: 'Hard', maxNumber: 100, maxAttempts: 5 },
};

// Helper Function
const getRandom = (max: number): number => Math.floor(Math.random() * max) + 1;
const getHint = (guess: number, target: number): string => {
    return guess === target ? 'Correct!' : guess > target ? 'Too High!' : 'Too Low';
}

const rl = readline.createInterface({ input, output });
const prompt = async(msg: string): Promise<string> => {
    try {
        return await rl.question(msg);
    } catch {
        throw new Error("error on io interface");
    }
}

const gameLoop = async(state: gameState): Promise<boolean> => {
    if (state.attemptsLeft <= 0) {
        console.log(`\nYou have no chances to guess left. The secret number was ${state.target}`);
        return false;
    }
    const guess = parseInt(await prompt(`[${state.attemptsLeft} chances] What\'s your guess: `), 10);

    if (Number.isNaN(guess)) {
        console.log('Invalid input. Please input a number');
        return gameLoop(state);
    }

    const hint = getHint(guess, state.target);
    console.log(hint);

    return hint === 'Correct!'
    ? true
    : gameLoop({ ...state, attemptsLeft: state.attemptsLeft - 1 });
}

const playGame = async(): Promise<void> => {
    console.log('\n--- GUESS THE NUMBER ---');
    console.log('Select Difficulty');
    for (const [k, v] of Object.entries(DIFFICULTY_CONFIG)) {
        console.log(`${k}. ${v.name} - Random up to ${v.maxNumber} (${v.maxAttempts} chances)`)
    }

    let choice = parseInt(await prompt('Enter your choice: '), 10) as DifficultyLevel;

    while(!DIFFICULTY_CONFIG[choice]){
        console.log('Please input the correct number');
        choice = parseInt(await prompt('Enter your choice: '), 10) as DifficultyLevel;
    }
    const config = DIFFICULTY_CONFIG[choice];
    console.log(`\nDifficulty ${config.name} chosen. Good Luck!`)

    const won = await gameLoop({
        target: getRandom(config.maxNumber),
        attemptsLeft: config.maxAttempts
    });

    if (won) console.log('Congratulations. You WON!');

    const retry = await prompt('Would you like to play again ? (y/n): ');
    return retry.toLowerCase().startsWith('y') ? playGame() : rl.close();
}

playGame().catch((err) => {
    console.log(`Fatal Error ${err}`);
    rl.close();
});