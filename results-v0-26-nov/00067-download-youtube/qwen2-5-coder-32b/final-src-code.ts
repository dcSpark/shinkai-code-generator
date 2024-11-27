
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { execSync } from 'node:child_process';

type CONFIG = {};
type INPUTS = { url: string, quality?: 'highest' | 'lowest' | '1080p' | '720p' | '480p' | '360p' };
type OUTPUT = { filePath: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { url, quality } = inputs;
    let qualityOption = '';

    if (quality) {
        switch (quality) {
            case 'highest':
                qualityOption = '-f best';
                break;
            case 'lowest':
                qualityOption = '-f worst';
                break;
            default:
                qualityOption = `-f "bestvideo[height<=${parseInt(quality)}]+bestaudio/best[height<=${parseInt(quality)}]"`;
        }
    } else {
        qualityOption = '-f best'; // Default to highest quality
    }

    const fileName = `downloaded_video_${Date.now()}.mp4`;
    const command = `youtube-dl ${qualityOption} -o "${fileName}" "${url}"`;

    try {
        execSync(command, { stdio: 'inherit' });
        return { filePath: fileName };
    } catch (error) {
        throw new Error(`Error downloading video: ${error.message}`);
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","quality":"720p"}')
  
  try {
    const program_result = await run({}, {"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","quality":"720p"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

