import { DIFFICULTY_CONFIG, type DifficultyLevel, type GameResult, type GameState } from './types.js';
import { prompt } from './utils.js';

export const selectDifficulty = async(): Promise<DifficultyLevel | 'quit'> => {
    const choiceStr = await prompt('Enter your choice (or "q" to exit): ');
    if (choiceStr === 'q') return 'quit';

    const choice = parseInt(choiceStr, 10);
    if (choice in DIFFICULTY_CONFIG) {
        return choice as DifficultyLevel;
    }

    console.log('Invalid selection. please choose 1, 2, 3 or q to exit');
    return selectDifficulty();
};

export const gameLoop = async(state: GameState): Promise<GameResult> => {
    // destructuring with an empty array as default value for prevGuess, so TypeScript will always treat is as an array
    const { target, attemptsLeft, config, prevGuess } = state;
    const attemptsUsed = config.maxAttempts - attemptsLeft;

    if (attemptsLeft <= 0) {
        console.log(`\nYou have no chances to guess left. The secret number was ${target}`);
        return { status: 'lose', attemptsUsed };
    }

    if (prevGuess.length > 0) {
        console.log(`Your previous guess: [${prevGuess.join(', ')}]`);
    }

    const inputStr = await prompt(`[${attemptsLeft} chances] What\'s your guess (or "q" for menu): `);
    if (inputStr.toLowerCase() === 'q') return { status: 'quit', attemptsUsed };

    const guess = parseInt(inputStr, 10);

    if (Number.isNaN(guess) || guess < 1 || guess > config.maxNumber) {
        console.log(`Please enter a number between 1 and ${config.maxNumber}`);
        return gameLoop(state);
    }

    if (prevGuess.includes(guess)) {
        console.log(`You already guessed ${guess} before, try a different number.`)
        // rerun the loop without change attemptsleft (same state)
        return gameLoop(state);
    }

    if (guess === target) {
        return { status: 'win', attemptsUsed: attemptsUsed + 1 };
    }
    console.log(guess > target ? 'Too High!' : 'Too Low!');

    return gameLoop({
        // no need to pass config, because ...state already have a config in it
        ...state,
        attemptsLeft: attemptsLeft - 1,
        prevGuess: [...prevGuess, guess],
    });
};