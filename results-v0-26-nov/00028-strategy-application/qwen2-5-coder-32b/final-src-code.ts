
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = {
  strategy: string,
  task: string,
  constraints?: string[],
  resources?: string[]
};
type OUTPUT = {};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { strategy, task, constraints = [], resources = [] } = inputs;

  const result = `Strategy: ${strategy}\nTask: ${task}\nConstraints: ${constraints.join(', ')}\nResources: ${resources.join(', ')}`;

  // Store the result in SQL
  await localRustToolkitShinkaiSqliteQueryExecutor(
    "CREATE TABLE IF NOT EXISTS task_results (id INTEGER PRIMARY KEY AUTOINCREMENT, strategy TEXT, task TEXT, constraints TEXT, resources TEXT);"
  );
  
  await localRustToolkitShinkaiSqliteQueryExecutor(
    "INSERT INTO task_results (strategy, task, constraints, resources) VALUES (?, ?, ?, ?);",
    [strategy, task, JSON.stringify(constraints), JSON.stringify(resources)]
  );

  return {};
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"strategy":"Agile methodology","task":"Develop a mobile app","constraints":["2-month deadline","3-person team"],"resources":["React Native","Firebase"]}')
  
  try {
    const program_result = await run({}, {"strategy":"Agile methodology","task":"Develop a mobile app","constraints":["2-month deadline","3-person team"],"resources":["React Native","Firebase"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

