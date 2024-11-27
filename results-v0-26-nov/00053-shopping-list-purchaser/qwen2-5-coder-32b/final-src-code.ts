
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { shopping_list: Array<{ item: string, quantity: number }>, preferred_stores: string[] };
type OUTPUT = { purchased_items: Array<{ store: string, item: string, quantity: number, success: boolean }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { shopping_list, preferred_stores } = inputs;
    const purchased_items: Array<{ store: string, item: string, quantity: number, success: boolean }> = [];

    for (const store of preferred_stores) {
        for (const { item, quantity } of shopping_list) {
            try {
                // Simulate API call to check and purchase items
                const response = await axios.post(`https://api.${store}.com/purchase`, { item, quantity });
                if (response.status === 200 && response.data.success) {
                    purchased_items.push({ store, item, quantity, success: true });
                } else {
                    purchased_items.push({ store, item, quantity, success: false });
                }
            } catch (error) {
                console.error(`Failed to purchase ${item} from ${store}:`, error);
                purchased_items.push({ store, item, quantity, success: false });
            }
        }
    }

    return { purchased_items };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"shopping_list":[{"item":"milk","quantity":2},{"item":"bread","quantity":1}],"preferred_stores":["Walmart","Target"]}')
  
  try {
    const program_result = await run({}, {"shopping_list":[{"item":"milk","quantity":2},{"item":"bread","quantity":1}],"preferred_stores":["Walmart","Target"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

