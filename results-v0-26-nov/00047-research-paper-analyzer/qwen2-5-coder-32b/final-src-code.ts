
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { paper_urls: string[], focus_areas?: string[] };
type OUTPUT = { summaries: { url: string, summary: string }[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const summarizePaper = async (url: string): Promise<string> => {
        try {
            const response = await axios.get(url);
            const text = response.data;
            // Simple summary logic (placeholder for actual summarization)
            const firstParagraph = text.split('\n').find(line => line.trim().length > 0) || '';
            return `Summary of ${url}: ${firstParagraph.slice(0, 150)}...`;
        } catch (error) {
            return `Failed to fetch or summarize paper from ${url}: ${error.message}`;
        }
    };

    const summaries = await Promise.all(inputs.paper_urls.map(async url => ({
        url,
        summary: await summarizePaper(url)
    })));

    return { summaries };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"paper_urls":["https://arxiv.org/abs/paper1","https://arxiv.org/abs/paper2"],"focus_areas":["methodology","results","conclusions"]}')
  
  try {
    const program_result = await run({}, {"paper_urls":["https://arxiv.org/abs/paper1","https://arxiv.org/abs/paper2"],"focus_areas":["methodology","results","conclusions"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

