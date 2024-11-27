import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { shopping_list: Array<{ item: string, quantity: number }>, location: string };
type OUTPUT = {};

async function fetchPrices(shoppingList: Array<{ item: string, quantity: number }>, location: string): Promise<Array<{ item: string, price: number, store: string }>> {
    // Placeholder for fetching prices logic
    // This should be replaced with actual API calls to get the best prices
    const results = [];
    for (const { item, quantity } of shoppingList) {
        try {
            const response = await axios.get(`https://api.example.com/prices?item=${encodeURIComponent(item)}&location=${encodeURIComponent(location)}&quantity=${quantity}`);
            if (response.data && response.data.prices.length > 0) {
                const bestPrice = response.data.prices.reduce((min, price) => (price.price < min.price ? price : min), { store: '', price: Infinity });
                results.push({ item, price: bestPrice.price * quantity, store: bestPrice.store });
            }
        } catch (error) {
            console.error(`Error fetching prices for ${item}:`, error);
        }
    }
    return results;
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { shopping_list, location } = inputs;
    const bestPrices = await fetchPrices(shopping_list, location);

    const sqlExecutor = localRustToolkitShinkaiSqliteQueryExecutor();
    await sqlExecutor("CREATE TABLE IF NOT EXISTS best_prices (item TEXT, price REAL, store TEXT)");

    for (const { item, price, store } of bestPrices) {
        await sqlExecutor(`INSERT INTO best_prices (item, price, store) VALUES ('${item}', ${price}, '${store}')`);
    }

    return {};
}