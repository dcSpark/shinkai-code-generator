
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { readFile } from 'npm:fs/promises@0.0.1';
import axios from 'npm:axios@1.6.2';

type CONFIG = {
    redditAccessToken: string;
};

type INPUTS = {
    image_path: string;
    subreddits: string[];
};

type OUTPUT = {
    success: boolean;
    messages: string[];
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { redditAccessToken } = config;
    const { image_path, subreddits } = inputs;

    const imageBuffer = await readFile(image_path);
    const base64Image = imageBuffer.toString('base64');

    const messages: string[] = [];
    let success = true;

    for (const subreddit of subreddits) {
        try {
            const url = `https://oauth.reddit.com/r/${subreddit}/api/upload_sr_img`;
            const formData = new FormData();
            formData.append('img_type', 'png'); // Assuming the image is a PNG
            formData.append('name', 'waifu');
            formData.append('file', base64Image);

            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${redditAccessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            messages.push(`Successfully posted to r/${subreddit}`);
        } catch (error) {
            success = false;
            messages.push(`Failed to post to r/${subreddit}: ${error.message}`);
        }
    }

    return { success, messages };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"image_path":"/path/to/waifu.png","subreddits":["awwnime","wholesomeanimemes"]}')
  
  try {
    const program_result = await run({}, {"image_path":"/path/to/waifu.png","subreddits":["awwnime","wholesomeanimemes"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

