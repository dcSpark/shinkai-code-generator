
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { topic: string, depth: 'basic' | 'intermediate' | 'advanced' };
type OUTPUT = {};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { topic, depth } = inputs;

    // Simulate research based on the depth
    let researchResult = '';
    switch (depth) {
        case 'basic':
            researchResult = `Basic information about ${topic}: This is a brief overview.`;
            break;
        case 'intermediate':
            researchResult = `Intermediate details about ${topic}: This goes into more specifics.`;
            break;
        case 'advanced':
            researchResult = `Advanced analysis of ${topic}: This includes deep insights and technical details.`;
            break;
    }

    // Store the result in SQL
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS ResearchResults (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            depth TEXT NOT NULL,
            result TEXT NOT NULL
        );
        INSERT INTO ResearchResults (topic, depth, result) VALUES (?, ?, ?);
    `;

    await localRustToolkitShinkaiSqliteQueryExecutor(sqlQuery, [topic, depth, researchResult]);

    return {};
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"topic":"quantum computing","depth":"intermediate"}')
  
  try {
    const program_result = await run({}, {"topic":"quantum computing","depth":"intermediate"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

