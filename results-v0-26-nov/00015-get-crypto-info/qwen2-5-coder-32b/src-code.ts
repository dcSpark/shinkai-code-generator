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