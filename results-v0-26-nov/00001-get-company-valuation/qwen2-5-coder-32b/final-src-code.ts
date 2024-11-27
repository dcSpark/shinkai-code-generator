
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { company_name: string; detailed?: boolean };
type OUTPUT = { 
    companyName: string;
    marketCap?: number;
    peRatio?: number;
    beta?: number;
    errorMessage?: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { company_name, detailed } = inputs;

    try {
        // Replace 'YOUR_API_KEY' with a valid API key from the chosen financial data provider
        const apiKey = 'YOUR_API_KEY';
        const apiUrl = `https://financialmodelingprep.com/api/v3/profile/${company_name}?apikey=${apiKey}`;

        const response = await axios.get(apiUrl);
        const data = response.data[0];

        if (!data) {
            return { companyName: company_name, errorMessage: 'Company not found.' };
        }

        const marketCap = parseFloat(data.mktCap) || undefined;
        const peRatio = parseFloat(data.peRatio) || undefined;
        const beta = parseFloat(data.beta) || undefined;

        if (detailed) {
            return {
                companyName: data.companyName,
                marketCap,
                peRatio,
                beta
            };
        } else {
            return {
                companyName: data.companyName,
                marketCap
            };
        }
    } catch (error) {
        return { companyName: company_name, errorMessage: error.message };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"company_name":"Apple Inc","detailed":true}')
  
  try {
    const program_result = await run({}, {"company_name":"Apple Inc","detailed":true});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

