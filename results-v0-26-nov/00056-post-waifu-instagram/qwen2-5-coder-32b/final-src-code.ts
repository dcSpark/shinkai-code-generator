
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';
import axios from 'npm:axios@1.6.2';
import FormData from 'npm:form-data@4.0.0';

type CONFIG = {
    instagramUsername: string;
    instagramPassword: string;
    sqliteDbPath: string;
};

type INPUTS = {
    image_path: string;
    caption_theme: string;
};

type OUTPUT = {
    success: boolean;
    message: string;
};

const getRandomHashtags = (theme: string) => {
    const themesToHashtags = {
        "anime": ["#anime", "#waifu", "#manga"],
        "fantasy": ["#fantasy", "#magic", "#dragon"],
        "nature": ["#nature", "#landscape", "#forest"]
    };
    return (themesToHashtags[theme.toLowerCase()] || []).join(" ");
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    try {
        // Simulate Instagram login and posting an image
        const formData = new FormData();
        formData.append('username', config.instagramUsername);
        formData.append('password', config.instagramPassword);
        formData.append('image', fs.createReadStream(inputs.image_path));
        formData.append('caption', `${inputs.caption_theme} ${getRandomHashtags(inputs.caption_theme)}`);

        // This is a placeholder for actual Instagram posting logic
        const response = await axios.post('https://fake-instagram-api.com/post', formData, {
            headers: formData.getHeaders()
        });

        if (response.status === 200) {
            // Store the result in SQL
            const query = `INSERT INTO posts (image_path, caption_theme, post_id, success) VALUES (?, ?, ?, ?)`;
            await localRustToolkitShinkaiSqliteQueryExecutor(config.sqliteDbPath, query, [
                inputs.image_path,
                inputs.caption_theme,
                response.data.postId,
                true
            ]);

            return { success: true, message: "Post successful" };
        } else {
            return { success: false, message: "Failed to post" };
        }
    } catch (error) {
        console.error("Error posting image:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"image_path":"/path/to/waifu.png","caption_theme":"kawaii"}')
  
  try {
    const program_result = await run({}, {"image_path":"/path/to/waifu.png","caption_theme":"kawaii"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

