
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { shinkaiDownloadPages } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { urls: string[] };
type OUTPUT = { markdowns: string[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const result = await shinkaiDownloadPages(inputs.urls);
    return result;
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"urls":["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"]}')
  
  try {
    const program_result = await run({}, {"urls":["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

