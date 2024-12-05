
  // These environment variables are required, before any import.
  // Do not remove them, as they set environment variables for the Shinkai Tools.
  Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  Deno.env.set('BEARER', "debug");
  Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  Deno.env.set('HOME', "results/typescript/typescript-00003-benchmark-config-sql/qwen2-5-coder-32b/editor/home");
  Deno.env.set('MOUNT', "results/typescript/typescript-00003-benchmark-config-sql/qwen2-5-coder-32b/editor/mount");
  Deno.env.set('ASSETS', "results/typescript/typescript-00003-benchmark-config-sql/qwen2-5-coder-32b/editor/assets");
  
import { shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {
  api_key: string;
};

type INPUTS = {
  prompt: string;
};

type OUTPUT = {};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.api_key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": inputs.prompt}]
    })
  });

  const data = await response.json();

  // Create table if not exists
  await shinkaiSqliteQueryExecutor('default', `
    CREATE TABLE IF NOT EXISTS openai_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert the response into the database
  await shinkaiSqliteQueryExecutor('default', `
    INSERT INTO openai_responses (prompt, response) 
    VALUES (?, ?)
  `, [inputs.prompt, JSON.stringify(data)]);

  return {};
}

  
  // console.log('Running...')
  // console.log('Config: {"api_key":""}')
  // console.log('Inputs: {"prompt":"2 + 2 = ?"}')
  
  try {
    const program_result = await run({"api_key":""}, {"prompt":"2 + 2 = ?"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

