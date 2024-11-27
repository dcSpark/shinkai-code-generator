```typescript
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

type CONFIG = {};
type INPUTS = { text: string };
type OUTPUT = { filePath: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { text } = inputs;
    const outputFilePath = './output.mp3';

    // Using espeak to convert text to speech and save as mp3
    execSync(`espeak -w ${outputFilePath} "${text}"`);

    return { filePath: outputFilePath };
}

/* 
This implementation uses espeak, a command-line speech synthesizer. It converts the given text to speech and saves it as an MP3 file.
Make sure espeak is installed on your system before running this code.
*/
```