import { getHomePath } from './shinkai-local-support.ts';
import { shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { content: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const homePath = getHomePath();
    const databaseName = 'default';
    
    // Create table if it doesn't exist
    await shinkaiSqliteQueryExecutor(databaseName, `
        CREATE TABLE IF NOT EXISTS website_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            content TEXT NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Fetch the website content
    const response = await fetch(inputs.url);
    if (!response.ok) {
        throw new Error(`Failed to fetch the website: ${inputs.url}`);
    }
    const content = await response.text();

    // Insert or update the website content in the database
    await shinkaiSqliteQueryExecutor(databaseName, `
        INSERT INTO website_content (url, content)
        VALUES (?, ?)
        ON CONFLICT(url) DO UPDATE SET content=excluded.content, last_updated=CURRENT_TIMESTAMP;
    `, [inputs.url, content]);

    // Retrieve the entire table
    const result = await shinkaiSqliteQueryExecutor(databaseName, 'SELECT * FROM website_content;');
    
    return { content: JSON.stringify(result.result) };
}