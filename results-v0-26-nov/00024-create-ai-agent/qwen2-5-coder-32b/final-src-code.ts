
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import localRustToolkitShinkaiSqliteQueryExecutor from 'npm:@shinkai/local-rust-toolkit-shinkai-sqlite-query-executor@1.0.0';

type CONFIG = {};
type INPUTS = { capabilities: string[], personality: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { capabilities, personality } = inputs;

    // Create a JSON representation of the AI agent
    const aiAgent = {
        capabilities,
        personality
    };

    // Convert the AI agent to a JSON string
    const aiAgentJson = JSON.stringify(aiAgent);

    try {
        // SQL command to insert the AI agent into the database
        const sqlCommand = `
            INSERT INTO ai_agents (agent_data)
            VALUES (?);
        `;

        // Execute the SQL command with the AI agent data
        await localRustToolkitShinkaiSqliteQueryExecutor(sqlCommand, [aiAgentJson]);

        return { success: true, message: "AI agent created successfully." };
    } catch (error) {
        /* Handle any errors that occur during the database operation */
        return { success: false, message: `Failed to create AI agent: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"capabilities":["text_generation","image_analysis","data_processing"],"personality":"helpful and professional"}')
  
  try {
    const program_result = await run({}, {"capabilities":["text_generation","image_analysis","data_processing"],"personality":"helpful and professional"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

