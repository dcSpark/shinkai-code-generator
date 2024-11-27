
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { phone_number: string, message: string };
type OUTPUT = { success: boolean, message?: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    try {
        // Assuming a WhatsApp Business API endpoint is used for sending messages
        const whatsappApiUrl = 'https://example.com/send'; // Replace with actual API URL
        const apiKey = 'your_api_key_here'; // Replace with actual API key

        const response = await axios.post(whatsappApiUrl, {
            phone_number: inputs.phone_number,
            message: inputs.message
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.status === "success") {
            return { success: true };
        } else {
            return { success: false, message: response.data.message || "Unknown error" };
        }
    } catch (error) {
        return { success: false, message: error.message || "An error occurred while sending the message." };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"phone_number":"+1234567890","message":"Hello from WhatsApp tool!"}')
  
  try {
    const program_result = await run({}, {"phone_number":"+1234567890","message":"Hello from WhatsApp tool!"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

