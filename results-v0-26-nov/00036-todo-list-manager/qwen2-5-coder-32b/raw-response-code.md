```typescript
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
```