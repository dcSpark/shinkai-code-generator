```typescript
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
```