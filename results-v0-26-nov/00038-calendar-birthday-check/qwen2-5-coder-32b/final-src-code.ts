
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { calendar_id: string, days_ahead: number };
type OUTPUT = { upcoming_birthdays: Array<{ name: string, date: string }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { calendar_id, days_ahead } = inputs;

    // Fetching birthdays from the SQLite database
    const query = `
        SELECT name, date 
        FROM birthdays 
        WHERE calendar_id = ? AND 
              julianday(date) BETWEEN julianday('now') AND julianday('now', '+' || ? || ' days');
    `;
    const results = await localRustToolkitShinkaiSqliteQueryExecutor(query, [calendar_id, days_ahead]);

    return { upcoming_birthdays: results };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"calendar_id":"primary","days_ahead":30}')
  
  try {
    const program_result = await run({}, {"calendar_id":"primary","days_ahead":30});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

