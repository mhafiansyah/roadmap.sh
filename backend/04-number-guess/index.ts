import { DIFFICULTY_CONFIG, type GameConfig } from "./types.js";
import { selectDifficulty, gameLoop } from "./game-logic.js";
import { rl, prompt, getRandom } from "./utils.js";
import { saveScore } from "./storage.js";

const playGame = async(): Promise<void> => {
    console.log('\n--- GUESS THE NUMBER ---');
    console.log('Select Difficulty');
    (Object.entries(DIFFICULTY_CONFIG) as [string, GameConfig][]).forEach(([key, cfg]) => {
        console.log(`${key}. ${cfg.name} (1 - ${cfg.maxNumber}, ${cfg.maxAttempts} attempts)`);
    })

    const choice = await selectDifficulty();
    if (choice === 'quit') {
        console.log('Exiting, see you next time . . .');
        return rl.close();
    }

    const config = DIFFICULTY_CONFIG[choice];
    console.log(`\n${config.name} Difficulty has been chosen.`);
    console.log(`a number between 1 and ${config.maxNumber} has been rolled.`);
    console.log('GOOD LUCK!');

    const { status, attemptsUsed } = await gameLoop({
        target: getRandom(config.maxNumber),
        attemptsLeft: config.maxAttempts,
        config,
        prevGuess: [],
    });

    if (status === 'win') {
        console.log(`Congratulations! You won in ${attemptsUsed} tries!`);

        // Handle ranking
        const name = await prompt('New High Score! Enter your name: ');
        const today = new Intl.DateTimeFormat('en-CA').format(new Date());

        await saveScore(choice, {
            name: name.trim() || 'Anonymous',
            attemptsUsed,
            date: today
        });
    }
    else if (status === 'quit') {
        console.log('Returning to main menu. . .')
        return playGame();
    };

    const retry = await prompt('Would you like to play again ? (y/n): ');
    return retry.toLowerCase().startsWith('y') ? playGame() : rl.close();
};

playGame().catch((err) => {
    console.log(`Fatal Error ${err instanceof Error ? err.message : err}`);
    rl.close();
    process.exit(1);
});