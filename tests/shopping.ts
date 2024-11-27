import { TestData } from "../types.ts";

export const shoppingTests: TestData[] = [
  {
    code: `shopping-list-creator`,
    prompt:
      `Generate a tool that can create a monthly supermarket shopping list.`,
    prompt_type:
      "type INPUT = { household_size: number, dietary_restrictions?: string[], budget?: number }",
    inputs: {
      household_size: 4,
      dietary_restrictions: ["vegetarian"],
      budget: 600,
    },
    tools: [],
    config: {},
  },
  {
    code: `shopping-price-optimizer`,
    prompt:
      `Generate a tool that can find the best prices for items on a shopping list.`,
    prompt_type:
      "type INPUT = { shopping_list: Array<{item: string, quantity: number}>, location: string }",
    inputs: {
      shopping_list: [{ item: "milk", quantity: 2 }, {
        item: "bread",
        quantity: 1,
      }],
      location: "San Francisco, CA",
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::shinkai_tool_download_pages:::shinkai__download_pages"
    ],
    config: {},
  },
  {
    code: `shopping-list-purchaser`,
    prompt:
      `Generate a tool that can automatically purchase items from a shopping list.`,
    prompt_type:
      "type INPUT = { shopping_list: Array<{item: string, quantity: number}>, preferred_stores: string[] }",
    inputs: {
      shopping_list: [{ item: "milk", quantity: 2 }, {
        item: "bread",
        quantity: 1,
      }],
      preferred_stores: ["Walmart", "Target"],
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::shinkai_tool_playwright_example:::shinkai__playwright_example",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor"
    ],
    config: {},
  },
  {
    code: `compare-product-prices`,
    prompt:
      `Generate a tool that can search and compare product prices across multiple online stores.`,
    prompt_type: "type INPUT = { product_name: string, max_price?: number }",
    inputs: {
      product_name: "iPhone 13 Pro 256GB",
      max_price: 1000,
    },
    tools: [],
    config: {},
  },
];
