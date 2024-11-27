
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { wallet_address: string; blockchain: string };
type OUTPUT = { nfts: Array<{ token_id: string; metadata: any }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { wallet_address, blockchain } = inputs;
    let url: string;

    switch (blockchain.toLowerCase()) {
        case 'ethereum':
            url = `https://api.opensea.io/api/v1/assets?owner=${wallet_address}`;
            break;
        case 'solana':
            url = `https://api-mainnet.magiceden.dev/v2/wallets/${wallet_address}/tokens`;
            break;
        default:
            throw new Error(`Unsupported blockchain: ${blockchain}`);
    }

    try {
        const response = await axios.get(url);
        let nfts = [];

        if (blockchain.toLowerCase() === 'ethereum') {
            nfts = response.data.assets.map((asset: any) => ({
                token_id: asset.token_id,
                metadata: asset
            }));
        } else if (blockchain.toLowerCase() === 'solana') {
            nfts = response.data.items.map((item: any) => ({
                token_id: item.id,
                metadata: item
            }));
        }

        return { nfts };
    } catch (error) {
        throw new Error(`Failed to fetch NFTs: ${error.message}`);
    }
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

