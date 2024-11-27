```typescript
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { game_type: string, difficulty: 'easy' | 'medium' | 'hard' };
type OUTPUT = { htmlContent: string };

const generateGameHtml = (gameType: string, difficulty: 'easy' | 'medium' | 'hard'): string => {
    let gameContent = '';

    if (gameType === 'number-guess') {
        const maxNumber = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;
        gameContent = `
            <h1>Number Guess Game</h1>
            <p>Guess a number between 1 and ${maxNumber}.</p>
            <input type="number" id="guessInput">
            <button onclick="checkGuess()">Submit</button>
            <p id="result"></p>

            <script>
                const secretNumber = Math.floor(Math.random() * ${maxNumber}) + 1;
                let attempts = 0;

                function checkGuess() {
                    const guess = parseInt(document.getElementById('guessInput').value);
                    attempts++;
                    if (guess === secretNumber) {
                        document.getElementById('result').textContent = \`Congratulations! You guessed the number in \${attempts} attempts.\`;
                    } else if (guess < secretNumber) {
                        document.getElementById('result').textContent = 'Too low!';
                    } else {
                        document.getElementById('result').textContent = 'Too high!';
                    }
                }
            </script>
        `;
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple Game</title>
        </head>
        <body>
            ${gameContent}
        </body>
        </html>
    `;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const htmlContent = generateGameHtml(inputs.game_type, inputs.difficulty);
    return { htmlContent };
}
```