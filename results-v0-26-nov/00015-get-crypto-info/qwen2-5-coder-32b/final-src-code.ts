
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { crypto_symbol: string };
type OUTPUT = {
    symbol: string;
    price: number;
    volume_24h: number;
    market_cap: number;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const symbol = inputs.crypto_symbol.toUpperCase();
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true`);
        const data = response.data[symbol.toLowerCase()];
        return {
            symbol: symbol,
            price: data.usd,
            volume_24h: data.usd_24h_vol,
            market_cap: data.usd_market_cap
        };
    } catch (error) {
        throw new Error(`Failed to retrieve data for ${symbol}: ${error.message}`);
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"crypto_symbol":"BTC"}')
  
  try {
    const program_result = await run({}, {"crypto_symbol":"BTC"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

