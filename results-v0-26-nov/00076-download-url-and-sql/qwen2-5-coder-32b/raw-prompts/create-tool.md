
# RULE I:
* You may use any of the following functions if they are relevant and a good match for the task.
* Import them in the following way (do not rename functions with 'as'):
`import { xx } from './shinkai-local-tools.ts'`

* This is the content of './shinkai-local-tools.ts':
```typescript
/**
 * Downloads one or more URLs and converts their HTML content to Markdown
 * @param urls - (required) 
 * @returns {
 *   markdowns: string[] 
 * }
 */
export async function shinkaiDownloadPages(urls: any[]): Promise<{
    markdowns: string[];
}>;

/**
 * Tool for executing a single SQL query on a specified database file. 
                If this tool is used, you need to create if not exists the tables used other queries.
                Table creation should always use 'CREATE TABLE IF NOT EXISTS'.
                
                Example table creation:
                CREATE TABLE IF NOT EXISTS table_name (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    field_1 TEXT NOT NULL,
                    field_2 DATETIME DEFAULT CURRENT_TIMESTAMP,
                    field_3 INTEGER,
                    field_4 TEXT
                );
                
                Example insert:
                INSERT INTO table_name (field_1, field_3, field_4) VALUES ('value_1', 1, 'value_4');
                
                Example read:
                SELECT * FROM table_name WHERE field_2 > datetime('now', '-1 day');
                SELECT field_1, field_3 FROM table_name WHERE field_3 > 100 ORDER BY field_2 DESC LIMIT 10;
 * @param database_name - (required, Database name. Use 'default' to use default database) 
 * @param query - (required, The SQL query to execute) 
 * @param query_params - (optional, The parameters to bind to the query) , default: undefined
 * @returns {
 *   result: any 
 *   rowCount: number 
 *   rowsAffected: number 
 *   type: string 
 * }
 */
export async function shinkaiSqliteQueryExecutor(database_name: string, query: string, query_params?: any[]): Promise<{
    result: any;
    rowCount: number;
    rowsAffected: number;
    type: string;
}>;


```

#RULE II:
* To implement the task you can update the CONFIG, INPUTS and OUTPUT types to match the run function type:
```typescript
type CONFIG = {};
type INPUTS = {};
type OUTPUT = {};
export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    return {};
}
```

# RULE III:
* This will be shared as a library, when used it run(...) function will be called.
* The function signature MUST be: `export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT>`
* If you need to import other libraries, do it in the Deno NPM format and with version, for example to import axios use 'import axios from 'npm:axios@1.6.2' with the 'npm:' prefix, and the exact version.
* If permanent memory is required, write to disk, store, sql always prioritize using shinkaiSqliteQueryExecutor.

# RULE IV:
* Do not output, notes, ideas, explanations or examples.
* Output only valid typescript code, so the complete Output can be directly executed.
* Only if required any additional notes, comments or explanation should be included in /* ... */ blocks.
* Write a single implementation file, only one typescript code block.
* Implements the code in typescript for the following INPUT:


