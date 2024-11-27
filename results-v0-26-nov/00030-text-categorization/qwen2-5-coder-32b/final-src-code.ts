
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = {
  text: string;
  predefined_categories?: string[];
  auto_categorize?: boolean;
  max_categories?: number;
};
type OUTPUT = {
  categories: string[];
};

const getOrCreateCategories = async (categories: string[]): Promise<string[]> => {
  const existingCategories = await localRustToolkitShinkaiSqliteQueryExecutor(
    "SELECT name FROM categories WHERE name IN (?)",
    [categories]
  );
  const existingCategoryNames = existingCategories.map((cat: any) => cat.name);
  const newCategories = categories.filter(cat => !existingCategoryNames.includes(cat));

  if (newCategories.length > 0) {
    await localRustToolkitShinkaiSqliteQueryExecutor(
      "INSERT INTO categories (name) VALUES ?",
      [newCategories.map((cat: string) => [cat])]
    );
  }

  return categories;
};

const autoCategorizeText = async (text: string, maxCategories: number): Promise<string[]> => {
  // This is a placeholder for the actual categorization logic.
  // In practice, you would use NLP techniques or a pre-trained model to categorize the text.
  // For demonstration purposes, we'll just return a random subset of predefined categories.

  const samplePredefinedCategories = ['Tech', 'Science', 'Health', 'Finance', 'Entertainment'];
  const shuffledCategories = samplePredefinedCategories.sort(() => Math.random() - 0.5);
  return shuffledCategories.slice(0, maxCategories || shuffledCategories.length);
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  let categories: string[] = [];

  if (inputs.predefined_categories && inputs.predefined_categories.length > 0) {
    categories = await getOrCreateCategories(inputs.predefined_categories);
  }

  if (inputs.auto_categorize) {
    const autoCategories = await autoCategorizeText(inputs.text, inputs.max_categories);
    categories = [...new Set([...categories, ...autoCategories])];
  }

  return { categories };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"text":"Bitcoin price surges 10% as major institutions increase cryptocurrency investments","predefined_categories":["finance","technology","cryptocurrency","business"],"auto_categorize":true,"max_categories":3}')
  
  try {
    const program_result = await run({}, {"text":"Bitcoin price surges 10% as major institutions increase cryptocurrency investments","predefined_categories":["finance","technology","cryptocurrency","business"],"auto_categorize":true,"max_categories":3});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

