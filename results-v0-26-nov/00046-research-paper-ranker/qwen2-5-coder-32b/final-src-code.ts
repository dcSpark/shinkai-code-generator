
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { topic: string, sort_by: 'citations' | 'relevance' | 'date', limit?: number };
type OUTPUT = { title: string, authors: string[], publication_date: string, citations: number, url: string }[];

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { topic, sort_by, limit = 10 } = inputs;
    
    // Using a mock API endpoint for demonstration purposes
    // Replace with actual research paper database API
    const response = await axios.get(`https://api.mock.com/search`, {
        params: {
            query: topic,
            sortBy: sort_by,
            limit: limit
        }
    });

    return response.data.map((paper: any) => ({
        title: paper.title,
        authors: paper.authors,
        publication_date: paper.publicationDate,
        citations: paper.citations || 0,
        url: paper.url
    }));
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"topic":"machine learning","sort_by":"citations","limit":10}')
  
  try {
    const program_result = await run({}, {"topic":"machine learning","sort_by":"citations","limit":10});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

