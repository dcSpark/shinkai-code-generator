
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {
    storeUrls: { [key: string]: string }; // URLs of the stores to search in
};

type INPUTS = {
    product_name: string;
    max_price?: number; // Optional maximum price filter
};

type StorePrice = {
    store: string;
    price: number;
    url: string;
};

type OUTPUT = {
    results: StorePrice[];
};

async function fetchProductPrices(storeUrl: string, productName: string): Promise<StorePrice[]> {
    try {
        const response = await axios.get(`${storeUrl}?search=${encodeURIComponent(productName)}`);
        // Assuming the response data is an array of products with 'price' and 'url' properties
        return response.data.map((product: any) => ({
            store: storeUrl,
            price: parseFloat(product.price),
            url: product.url
        }));
    } catch (error) {
        console.error(`Error fetching from ${storeUrl}:`, error);
        return [];
    }
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { product_name, max_price } = inputs;
    const allPrices: StorePrice[] = [];

    for (const [storeName, storeUrl] of Object.entries(config.storeUrls)) {
        const prices = await fetchProductPrices(storeUrl, product_name);
        allPrices.push(...prices.filter(price => !max_price || price.price <= max_price));
    }

    return { results: allPrices };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"product_name":"iPhone 13 Pro 256GB","max_price":1000}')
  
  try {
    const program_result = await run({}, {"product_name":"iPhone 13 Pro 256GB","max_price":1000});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

