import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { shopping_list: Array<{ item: string, quantity: number }>, preferred_stores: string[] };
type OUTPUT = { purchased_items: Array<{ store: string, item: string, quantity: number, success: boolean }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { shopping_list, preferred_stores } = inputs;
    const purchased_items: Array<{ store: string, item: string, quantity: number, success: boolean }> = [];

    for (const store of preferred_stores) {
        for (const { item, quantity } of shopping_list) {
            try {
                // Simulate API call to check and purchase items
                const response = await axios.post(`https://api.${store}.com/purchase`, { item, quantity });
                if (response.status === 200 && response.data.success) {
                    purchased_items.push({ store, item, quantity, success: true });
                } else {
                    purchased_items.push({ store, item, quantity, success: false });
                }
            } catch (error) {
                console.error(`Failed to purchase ${item} from ${store}:`, error);
                purchased_items.push({ store, item, quantity, success: false });
            }
        }
    }

    return { purchased_items };
}