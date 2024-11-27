
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { shinkaiDownloadPages, shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { urls: string[] };
type OUTPUT = { query_results: any[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { urls } = inputs;

    // Step 1: Download URLs and convert to Markdown
    const { markdowns } = await shinkaiDownloadPages(urls);

    // Step 2: Create table if not exists
    await shinkaiSqliteQueryExecutor('default', `
        CREATE TABLE IF NOT EXISTS downloaded_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Step 3: Insert downloaded content into the database
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const content = markdowns[i];
        await shinkaiSqliteQueryExecutor('default', `
            INSERT INTO downloaded_content (url, content) VALUES (?, ?);
        `, [url, content]);
    }

    // Step 4: Query the database and return all results
    const { result } = await shinkaiSqliteQueryExecutor('default', 'SELECT * FROM downloaded_content;');

    return {
        query_results: result
    };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"urls":["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"]}')
  
  try {
    const program_result = await run({}, {"urls":["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

