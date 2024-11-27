
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor as sqliteExecutor } from './shinkai-local-tools.ts';
import ffmpeg from 'npm:fluent-ffmpeg@2.0.16';
import speech from 'npm:speech-to-text@0.3.4';

type CONFIG = {};
type INPUTS = { file_path: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { file_path } = inputs;

    try {
        // Convert audio to WAV format if necessary
        const wavFilePath = `${file_path.split('.').slice(0, -1).join('.')}.wav`;
        await new Promise((resolve, reject) => {
            ffmpeg(file_path)
                .output(wavFilePath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        // Convert speech to text
        const transcription = await new Promise<string>((resolve, reject) => {
            speech.recognize({
                file: wavFilePath,
                language: 'en-US'
            }, (err: any, data: any) => {
                if (err) return reject(err);
                resolve(data.text);
            });
        });

        // Store the transcription in SQL
        const query = `INSERT INTO transcriptions (file_path, text) VALUES (?, ?);`;
        await sqliteExecutor(query, [file_path, transcription]);

        return { success: true, message: 'Transcription stored successfully.' };
    } catch (error) {
        return { success: false, message: `Error during transcription process: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"file_path":"data.mp3"}')
  
  try {
    const program_result = await run({}, {"file_path":"data.mp3"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

