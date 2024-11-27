
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { task: string, constraints?: string[] };
type OUTPUT = { recommendedMethods: string[], researchSummary: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { task, constraints } = inputs;
    let query = `Best methods for accomplishing ${task}`;

    if (constraints && constraints.length > 0) {
        query += ` with constraints: ${constraints.join(', ')}`;
    }

    try {
        // Using a placeholder API for demonstration purposes
        const response = await axios.get(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
        const data = response.data;

        /* Assuming the API returns an array of results with 'method' and 'summary' fields */
        const recommendedMethods = data.results.map((result: any) => result.method);
        const researchSummary = data.summary || 'No specific summary provided.';

        return { recommendedMethods, researchSummary };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { recommendedMethods: [], researchSummary: 'Failed to retrieve recommendations.' };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"task":"Learn a new programming language","constraints":["limited time","self-paced"]}')
  
  try {
    const program_result = await run({}, {"task":"Learn a new programming language","constraints":["limited time","self-paced"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

