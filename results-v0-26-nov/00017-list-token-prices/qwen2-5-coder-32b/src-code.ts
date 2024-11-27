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