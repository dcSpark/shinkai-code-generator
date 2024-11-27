
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import localRustToolkitShinkaiSqliteQueryExecutor from 'npm:@local/shinkai-sqlite@1.0.0';

type CONFIG = {};
type INPUTS = { company_name: string, industry: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { company_name, industry } = inputs;

    // Simulate fetching business model data from an external source or analysis
    const businessModelData = `Business Model of ${company_name} in the ${industry} industry`;

    try {
        // Store the result in SQL using localRustToolkitShinkaiSqliteQueryExecutor
        await localRustToolkitShinkaiSqliteQueryExecutor(`
            CREATE TABLE IF NOT EXISTS business_models (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name TEXT NOT NULL,
                industry TEXT NOT NULL,
                model_description TEXT NOT NULL
            );
        `);

        await localRustToolkitShinkaiSqliteQueryExecutor(`
            INSERT INTO business_models (company_name, industry, model_description)
            VALUES (?, ?, ?);
        `, [company_name, industry, businessModelData]);

        return { success: true, message: "Business model data successfully stored" };
    } catch (error) {
        /* Handle errors appropriately */
        console.error(error);
        return { success: false, message: `Error storing business model data: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"company_name":"Airbnb","industry":"hospitality"}')
  
  try {
    const program_result = await run({}, {"company_name":"Airbnb","industry":"hospitality"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

