
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { company_name: string, year_from?: number };
type OUTPUT = { summary: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { company_name, year_from } = inputs;
    let query = `history of ${company_name}`;
    
    if (year_from !== undefined) {
        query += ` since ${year_from}`;
    }

    try {
        const response = await axios.get('https://api.openai.com/v1/engines/davinci-codex/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            },
            data: {
                prompt: query,
                max_tokens: 500
            }
        });

        const summary = response.data.choices[0].text.trim();
        return { summary };
    } catch (error) {
        /* Error handling can be improved based on specific requirements */
        return { summary: `Failed to retrieve history for ${company_name}. Please try again later.` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"company_name":"Microsoft","year_from":1975}')
  
  try {
    const program_result = await run({}, {"company_name":"Microsoft","year_from":1975});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

