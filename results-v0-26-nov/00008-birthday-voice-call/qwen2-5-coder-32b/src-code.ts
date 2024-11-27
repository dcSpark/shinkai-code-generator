import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { phone_number: string, name: string, voice_model_path: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { phone_number, name, voice_model_path } = inputs;

    try {
        // Generate the happy birthday message with the specified voice model
        const response = await axios.post('https://api.example.com/generate-voice', {
            text: `Happy Birthday ${name}!`,
            voice_model_path: voice_model_path
        }, {
            responseType: 'arraybuffer'
        });

        if (response.status !== 200) {
            throw new Error(`Failed to generate voice message, status code: ${response.status}`);
        }

        const audioBuffer = response.data;

        // Make the voice call with the generated message
        const callResponse = await axios.post('https://api.example.com/make-call', {
            phone_number: phone_number,
            audio_data: audioBuffer.toString('base64')
        });

        if (callResponse.status !== 200) {
            throw new Error(`Failed to make voice call, status code: ${callResponse.status}`);
        }

        // Store the result in SQL
        const query = `
            INSERT INTO calls (phone_number, name, message, success)
            VALUES (?, ?, ?, ?);
        `;
        await localRustToolkitShinkaiSqliteQueryExecutor(query, [phone_number, name, `Happy Birthday ${name}!`, true]);

        return { success: true, message: 'Voice call made successfully' };
    } catch (error) {
        console.error(error);
        // Store the failure in SQL
        const query = `
            INSERT INTO calls (phone_number, name, message, success)
            VALUES (?, ?, ?, ?);
        `;
        await localRustToolkitShinkaiSqliteQueryExecutor(query, [phone_number, name, `Happy Birthday ${name}!`, false]);

        return { success: false, message: 'Failed to make voice call' };
    }
}