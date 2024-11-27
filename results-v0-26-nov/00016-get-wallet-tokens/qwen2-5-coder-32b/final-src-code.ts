
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import localRustToolkitShinkaiSqliteQueryExecutor from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { wallet_address: string; blockchain: string };
type OUTPUT = {};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { wallet_address, blockchain } = inputs;

    let tokenAmount = 0;
    try {
        // This is a placeholder for the actual API call to get the token amount.
        // Depending on the blockchain, you would use different APIs (e.g., Etherscan for Ethereum).
        // For demonstration purposes, we'll assume there's an API that returns the token amount.
        const response = await fetch(`https://api.example.com/${blockchain}/balance?address=${wallet_address}`);
        const data = await response.json();
        tokenAmount = data.balance;
    } catch (error) {
        console.error('Error fetching token balance:', error);
    }

    // Store the result in SQL
    try {
        const query = `INSERT INTO wallet_balances (wallet_address, blockchain, token_amount) VALUES (?, ?, ?)`;
        await localRustToolkitShinkaiSqliteQueryExecutor(query, [wallet_address, blockchain, tokenAmount]);
    } catch (error) {
        console.error('Error storing data in SQL:', error);
    }

    return {};
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

