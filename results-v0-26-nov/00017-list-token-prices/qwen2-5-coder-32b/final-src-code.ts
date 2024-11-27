
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { wallet_address: string, blockchain: string };
type OUTPUT = { tokens: Array<{ symbol: string, price: number }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { wallet_address, blockchain } = inputs;

    let apiUrl: string;
    switch (blockchain.toLowerCase()) {
        case 'ethereum':
            apiUrl = `https://api.covalenthq.com/v1/1/address/${wallet_address}/balances_v2/?key=YOUR_COVALENT_API_KEY`;
            break;
        case 'bsc':
            apiUrl = `https://api.covalenthq.com/v1/56/address/${wallet_address}/balances_v2/?key=YOUR_COVALENT_API_KEY`;
            break;
        // Add more blockchains as needed
        default:
            throw new Error(`Blockchain ${blockchain} is not supported.`);
    }

    const response = await axios.get(apiUrl);
    const tokens = response.data.data.items.map((item: any) => ({
        symbol: item.contract_ticker_symbol,
        price: parseFloat(item.quote)
    }));

    return { tokens };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"wallet_address":"0x742d35Cc6634C0532925a3b844Bc454e4438f44e","blockchain":"ethereum"}')
  
  try {
    const program_result = await run({}, {"wallet_address":"0x742d35Cc6634C0532925a3b844Bc454e4438f44e","blockchain":"ethereum"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

