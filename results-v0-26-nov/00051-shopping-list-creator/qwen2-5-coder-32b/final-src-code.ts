
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = {
    household_size: number,
    dietary_restrictions?: string[],
    budget?: number
};
type OUTPUT = {
    shopping_list: Record<string, number>
};

const BASE_ITEMS = {
    "Apples": 2,
    "Bananas": 4,
    "Bread": 1,
    "Milk": 2,
    "Eggs": 12,
    "Chicken Breast": 1,
    "Rice": 1,
    "Pasta": 1,
    "Spaghetti Sauce": 1,
    "Cereal": 1,
    "Toilet Paper": 1,
    "Laundry Detergent": 1
};

const RESTRICTION_ITEMS = {
    "vegan": {
        "Eggs": 0,
        "Chicken Breast": 0,
        "Milk": 0,
        "Almond Milk": 2,
        "Tofu": 1,
        "Lentils": 1
    },
    "vegetarian": {
        "Chicken Breast": 0,
        "Eggs": 2,
        "Milk": 2,
        "Vegetable Stock": 1
    },
    "gluten_free": {
        "Bread": 0,
        "Gluten-Free Bread": 1,
        "Pasta": 0,
        "Gluten-Free Pasta": 1,
        "Spaghetti Sauce": 1.5
    }
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    let shoppingList = { ...BASE_ITEMS };

    // Adjust quantities based on household size
    for (let item in shoppingList) {
        shoppingList[item] *= inputs.household_size;
    }

    // Apply dietary restrictions
    if (inputs.dietary_restrictions) {
        for (let restriction of inputs.dietary_restrictions) {
            if (RESTRICTION_ITEMS[restriction]) {
                for (let item in RESTRICTION_ITEMS[restriction]) {
                    if (shoppingList[item] !== undefined) {
                        shoppingList[item] += RESTRICTION_ITEMS[restriction][item];
                    } else {
                        shoppingList[item] = RESTRICTION_ITEMS[restriction][item];
                    }
                }
            }
        }
    }

    // Filter out items with zero quantity
    for (let item in shoppingList) {
        if (shoppingList[item] === 0) {
            delete shoppingList[item];
        }
    }

    // Optionally adjust based on budget
    if (inputs.budget !== undefined) {
        /* Here you could add logic to prioritize certain items or remove non-essential ones.
           This is a placeholder for budget adjustment logic. */
    }

    return { shopping_list: shoppingList };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"household_size":4,"dietary_restrictions":["vegetarian"],"budget":600}')
  
  try {
    const program_result = await run({}, {"household_size":4,"dietary_restrictions":["vegetarian"],"budget":600});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

