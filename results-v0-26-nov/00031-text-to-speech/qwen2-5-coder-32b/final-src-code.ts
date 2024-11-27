
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
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

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"text":"Hello, how are you?"}')
  
  try {
    const program_result = await run({}, {"text":"Hello, how are you?"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

