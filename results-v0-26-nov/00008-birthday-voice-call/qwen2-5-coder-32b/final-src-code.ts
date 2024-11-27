
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
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

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"phone_number":"+1234567890","name":"John","voice_model_path":"/path/to/voice/model.wav"}')
  
  try {
    const program_result = await run({}, {"phone_number":"+1234567890","name":"John","voice_model_path":"/path/to/voice/model.wav"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

