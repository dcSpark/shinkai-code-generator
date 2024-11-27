
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { location: string, price_range: [number, number], requirements: string[] };
type OUTPUT = { apartments: any[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { location, price_range, requirements } = inputs;
    const [minPrice, maxPrice] = price_range;

    /* Constructing the SQL query to search for apartments based on given criteria */
    let query = `SELECT * FROM apartments WHERE location = ? AND price BETWEEN ? AND ?`;
    let params: any[] = [location, minPrice, maxPrice];

    requirements.forEach((requirement, index) => {
        query += ` AND requirements LIKE ?`;
        params.push(`%${requirement}%`);
    });

    const result = await localRustToolkitShinkaiSqliteQueryExecutor(query, params);
    return { apartments: result };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"location":"Seattle, WA","price_range":[1500,2500],"requirements":["pet-friendly","in-unit-washer","parking"]}')
  
  try {
    const program_result = await run({}, {"location":"Seattle, WA","price_range":[1500,2500],"requirements":["pet-friendly","in-unit-washer","parking"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

