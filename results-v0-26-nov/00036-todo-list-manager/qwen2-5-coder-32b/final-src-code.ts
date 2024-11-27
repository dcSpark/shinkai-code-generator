
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import localRustToolkitShinkaiSqliteQueryExecutor from 'npm:@shinkai/local-rust-toolkit@1.0.0';

type CONFIG = {};
type INPUTS = { tasks: Array<{title: string, category: string, due_date: string}> };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const dbPath = './todo_list.db';

    // Initialize database and create table if not exists
    await localRustToolkitShinkaiSqliteQueryExecutor(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        due_date TEXT NOT NULL
    )`, dbPath);

    // Insert tasks into the database
    for (const task of inputs.tasks) {
        const query = `INSERT INTO todos (title, category, due_date) VALUES (?, ?, ?)`;
        await localRustToolkitShinkaiSqliteQueryExecutor(query, dbPath, [task.title, task.category, task.due_date]);
    }

    return { success: true, message: "Tasks have been successfully added to the todo list." };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"tasks":[{"title":"Complete project proposal","category":"work","due_date":"2024-04-01"},{"title":"Buy groceries","category":"personal","due_date":"2024-03-25"}]}')
  
  try {
    const program_result = await run({}, {"tasks":[{"title":"Complete project proposal","category":"work","due_date":"2024-04-01"},{"title":"Buy groceries","category":"personal","due_date":"2024-03-25"}]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

