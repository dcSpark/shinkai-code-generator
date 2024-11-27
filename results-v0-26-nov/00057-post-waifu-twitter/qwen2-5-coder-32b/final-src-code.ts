
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

type CONFIG = {};
type INPUTS = { image_path: string, tweet_text: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { image_path, tweet_text } = inputs;

    try {
        // Ensure the Twitter CLI is installed and logged in
        execSync('tw url', { stdio: 'ignore' });

        // Post the tweet with the image
        const command = `tw img post -F ${image_path} -m "${tweet_text}"`;
        execSync(command);

        return { success: true, message: "Tweet posted successfully!" };
    } catch (error) {
        return { success: false, message: `Failed to post tweet: ${error.message}` };
    }
}

/* 
This implementation assumes that the Twitter CLI tool ('tw') is installed and configured on the system.
The 'tw img post' command is used to post an image with accompanying text.
Ensure that the path provided in 'image_path' is correct and accessible from the execution environment.
*/

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"image_path":"/path/to/waifu.png","tweet_text":"Your daily dose of kawaii! ✨"}')
  
  try {
    const program_result = await run({}, {"image_path":"/path/to/waifu.png","tweet_text":"Your daily dose of kawaii! ✨"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

