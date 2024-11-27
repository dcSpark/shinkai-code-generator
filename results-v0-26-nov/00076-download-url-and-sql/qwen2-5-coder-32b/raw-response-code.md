```typescript
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
```