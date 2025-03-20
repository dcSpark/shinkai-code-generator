
/**
 * Tool for executing Node.js code. This is unsafe and should be used with extreme caution.
 * @param input - {
 *   code: string - The TypeScript code to execute
 *   config: object - Configuration for the code execution
 *   package: string - The package.json contents
 *   parameters: object - Parameters to pass to the code
 *
 * @returns {
*   stdout: string;
* }
*/
export async function shinkaiTypescriptUnsafeProcessor(input: { package: string, config: object, code: string, parameters: object }): Promise<{
    stdout: string;
}>;

/**
* Tool for applying a prompt over a long text (longer than the context window of the LLM) using an AI LLM.
This can be used to process complex requests, text analysis, text matching, text generation, and any other AI LLM task. over long texts.
* @param input - {
*   data: string - The data to process
*   prompt: string - The prompt to apply over the data
*   tools?: string[] - List of tools names or tool router keys to be used with the prompt
*
* @returns {
*   response: string;
* }
*/
export async function shinkaiLlmMapReduceProcessor(input: { data: string, prompt: string, tools?: any[] }): Promise<{
    response: string;
}>;

/**
* Tool for processing any prompt using an AI LLM.
Analyzing the input prompt and returning a string with the result of the prompt.
This can be used to process complex requests, text analysis, text matching, text generation, and any other AI LLM task.
* @param input - {
*   format: string - Response type. The only valid option is 'text'
*   prompt: string - The prompt to process
*   tools?: string[] - List of tools names or tool router keys to be used with the prompt
*
* @returns {
*   message: string;
* }
*/
export async function shinkaiLlmPromptProcessor(input: { prompt: string, tools?: any[], format: string }): Promise<{
    message: string;
}>;

/**
* Tool for executing a single SQL query on a specified database file.
If this tool is used, you need to create if not exists the tables used other queries.
Table creation should always use 'CREATE TABLE IF NOT EXISTS'.

-- Example table creation:
CREATE TABLE IF NOT EXISTS table_name (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   field_1 TEXT NOT NULL,
   field_2 DATETIME DEFAULT CURRENT_TIMESTAMP,
   field_3 INTEGER,
   field_4 TEXT
);

-- Example insert:
INSERT INTO table_name (field_1, field_3, field_4)
   VALUES ('value_1', 3, 'value_4')
   ON CONFLICT(id) DO UPDATE SET field_1 = 'value_1', field_3 = 3, field_4 = 'value_4';
;

-- Example read:
SELECT * FROM table_name WHERE field_2 > datetime('now', '-1 day');
SELECT field_1, field_3 FROM table_name WHERE field_3 > 100 ORDER BY field_2 DESC LIMIT 10;
* @param input - {
*   params?: any[] - The parameters to pass to the query
*   query: string - The SQL query to execute
*
* @returns {
*   result: any;
*   rowCount: number;
*   rowsAffected: number;
*   type: string;
* }
*/
export async function shinkaiSqliteQueryExecutor(input: { query: string, params?: any[] }): Promise<{
    result: any;
    rowCount: number;
    rowsAffected: number;
    type: string;
}>;

/**
* Tool for processing embeddings within a job scope.
This tool processes resources and generates embeddings using a specified mapping function.

Example usage:
- Provide a custom mapping function to transform resource content.
- Process resources in chunks to optimize performance.
- Collect and join processed embeddings for further analysis.
* @param input - {
*   map_function?: string - The map function to use
*   prompt: string - The prompt to use
*
* @returns {
*   result: string;
*   rowCount: number;
*   rowsAffected: number;
*   type: string;
* }
*/
export async function shinkaiProcessEmbeddings(input: { prompt: string, map_function?: string }): Promise<{
    result: string;
    rowCount: number;
    rowsAffected: number;
    type: string;
}>;

/**
* Tool for updating the configuration of a tool.
This tool allows you to update config fields of a tool by providing the tool_router_key and config key-value pairs.

Example usage:
{
   "tool_router_key": "local:::deno_toolkit:::my_tool",
   "config": {
           "api_key": "some-api-key",
           "api_secret": "some-api-secret"
   }
}
* @param input - {
*   config: object - Configuration key-value pairs to update
*   tool_router_key: string - The tool_router_key of the tool to update
*
* @returns {
*   message: string;
*   success: boolean;
* }
*/
export async function shinkaiToolConfigUpdater(input: { config: object, tool_router_key: string }): Promise<{
    message: string;
    success: boolean;
}>;

/**
* Tool for getting the balance of a Coinbase wallet after restoring it
* @param input - {
*   walletId?: string - Optional wallet ID to get balance for a specific wallet
*
* @returns {
*   balances: object;
*   message: string;
* }
*/
export async function coinbaseBalanceGetter(input: { walletId?: string }): Promise<{
    balances: object;
    message: string;
}>;

/**
* Function to post a tweet to Twitter.
* @param input - {
*   imagePath?: string - Path to the image to post
*   text?: string - Message to post
*
* @returns {
*   data: string;
* }
*/
export async function xTwitterPost(input: { text?: string, imagePath?: string }): Promise<{
    data: string;
}>;

/**
* Parses and evaluates mathematical expressions. It’s a safer and more math-oriented alternative to using JavaScript’s eval function for mathematical expressions.
* @param input - {
*   expression: string - The mathematical expression to evaluate (e.g., '2 + 2 * 3')
*
* @returns {
*   result: string;
* }
*/
export async function mathExpressionEvaluator(input: { expression: string }): Promise<{
    result: string;
}>;

/**
* Searches the DuckDuckGo search engine. Example result: [{"title": "IMDb Top 250 Movies", "description": "Find out which <b>movies</b> are rated as the <b>best</b> <b>of</b> <b>all</b> <b>time</b> by IMDb users. See the list of 250 titles sorted by ranking, genre, year, and rating, and learn how the list is determined.", "url": "https://www.imdb.com/chart/top/"}]
* @param input - {
*   message: string - The search query to send to DuckDuckGo
*
* @returns {
*   message: string;
*   puppeteer: boolean;
* }
*/
export async function duckduckgoSearch(input: { message: string }): Promise<{
    message: string;
    puppeteer: boolean;
}>;

/**
* Handles memory storage and retrieval using a SQLite database.
* @param input - {
*   data?: string - The data to process for memory management, if not provided, the tool will return existing memories
*   general_prompt?: string - The general prompt for generating memories
*   key?: string - The key for specific memory retrieval
*   specific_prompt?: string - The specific prompt for generating memories
*
* @returns {
*   generalMemory: string;
*   specificMemory: string;
* }
*/
export async function memoryManagement(input: { general_prompt?: string, data?: string, key?: string, specific_prompt?: string }): Promise<{
    generalMemory: string;
    specificMemory: string;
}>;
/**
* Query the SQL database for results from memoryManagement
*
* Available SQL Tables:
* memory_table
* CREATE TABLE IF NOT EXISTS memory_table (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME DEFAULT CURRENT_TIMESTAMP, key TEXT, memory TEXT)
*
* Example / Reference SQL Queries:
* Get general memory
* SELECT id, key, memory FROM memory_table WHERE key IS NULL

* Get specific memory
* SELECT id, key, memory FROM memory_table WHERE key = ?

* Update memory
* UPDATE memory_table SET memory = ? WHERE id = ?

*
* @param query - SQL query to execute
* @param params - Optional array of parameters for the query
* @returns Query results
*/

async function query_memoryManagement(query: string, params?: any[]);
/**
* Writes the text contents of a file to the given path.
* @param input - {
*   content: string - The content to write to the file.
*   path: string - The path of the file to write to.
*
* @returns {
*   message: string;
* }
*/
export async function writeFileContents(input: { content: string, path: string }): Promise<{
    message: string;
}>;

/**
* Generates responses to emails based on a given context and memory, and logs answered emails in a database.
* @param input - {
*   from_date?: string - The starting date for fetching emails in DD-Mon-YYYY format
*   to_date?: string - The ending date for fetching emails in DD-Mon-YYYY format
*
* @returns {
*   login_status: string;
*   mail_ids: string[];
*   skipped: string[];
*   table_created: boolean;
* }
*/
export async function emailAnswerer(input: { to_date?: string, from_date?: string }): Promise<{
    login_status: string;
    mail_ids: string[];
    skipped: string[];
    table_created: boolean;
}>;
/**
* Query the SQL database for results from emailAnswerer
*
* Available SQL Tables:
* answered_emails
* CREATE TABLE IF NOT EXISTS answered_emails (email_unique_id TEXT UNIQUE PRIMARY KEY, subject TEXT NOT NULL, email TEXT NOT NULL, response TEXT NOT NULL, received_date DATETIME NOT NULL, response_date DATETIME DEFAULT CURRENT_TIMESTAMP)
*
* Example / Reference SQL Queries:
* Get answered emails
* SELECT * FROM answered_emails

* Get email by unique ID
* SELECT * FROM answered_emails WHERE email_unique_id = :emailUniqueId

* Insert new email
* INSERT INTO answered_emails (email_unique_id, subject, email, response, received_date) VALUES (:emailUniqueId, :subject, :email, :response, :receivedDate)

*
* @param query - SQL query to execute
* @param params - Optional array of parameters for the query
* @returns Query results
*/

async function query_emailAnswerer(query: string, params?: any[]);
/**
* Generates a meme image based on a joke by selecting a template and splitting the joke into appropriate parts.
* @param input - {
*   joke: string - The joke to create the meme from
*
* @returns {
*   memeUrl: string;
* }
*/
export async function memeGenerator(input: { joke: string }): Promise<{
    memeUrl: string;
}>;

/**
* Tool for creating a Coinbase wallet
* @param input - {
*
* @returns {
*   address: string;
*   seed: string;
*   walletId: string;
* }
*/
export async function coinbaseWalletCreator(input: {}): Promise<{
    address: string;
    seed: string;
    walletId: string;
}>;

/**
* Searches the internet using Perplexity
* @param input - {
*   query: string - The search query to send to Perplexity
*
* @returns {
*   response: string;
* }
*/
export async function perplexity(input: { query: string }): Promise<{
    response: string;
}>;

/**
* Applies a prompt to the file contents.
* @param input - {
*   path: string - The path of the file to update.
*   prompt: string - The prompt to apply to the file contents.
*
* @returns {
*   message: string;
*   new_file_content: string;
* }
*/
export async function updateFileWithPrompt(input: { path: string, prompt: string }): Promise<{
    message: string;
    new_file_content: string;
}>;

/**
* Fetches the transcript of a YouTube video and generates a formatted summary using an LLM.
* @param input - {
*   lang?: string - The language for the transcript (optional)
*   url: string - The URL of the YouTube video
*
* @returns {
*   summary: string;
* }
*/
export async function youtubeTranscriptSummarizer(input: { url: string, lang?: string }): Promise<{
    summary: string;
}>;

/**
* This function takes a question as input and returns a comprehensive answer, along with the sources and statements used to generate the answer.
* @param input - {
*   question: string - The question to answer
*
* @returns {
*   response: string;
*   sources: object[];
*   statements: object[];
* }
*/
export async function smartSearchEngine(input: { question: string }): Promise<{
    response: string;
    sources: object[];
    statements: object[];
}>;

/**
* Fetches emails from an IMAP server and returns their subject, date, sender, and text content.
* @param input - {
*   from_date?: string - The start date for the email search (optional)
*   to_date?: string - The end date for the email search (optional)
*
* @returns {
*   emails: object[];
*   login_status: string;
* }
*/
export async function emailFetcher(input: { to_date?: string, from_date?: string }): Promise<{
    emails: object[];
    login_status: string;
}>;

/**
* Fetch from X/Twitter API to perform various search and retrieval operations.
* @param input - {
*   command: string - The exact command to execute: 'search-top' | 'search-suggestions' | 'search-latest' | 'get-user-posts' | 'get-post-by-id'
*   searchQuery?: string - The search query for fetching tweets
*   tweetId?: string - The ID of the tweet to retrieve
*   username?: string - The username for retrieving user posts
*
* @returns {
*   data: object;
* }
*/
export async function xTwitterSearch(input: { username?: string, tweetId?: string, searchQuery?: string, command: string }): Promise<{
    data: object;
}>;

/**
* Reads the text contents of a file from the given path.
* @param input - {
*   path: string - The path of the file to read.
*
* @returns {
*   content: string;
* }
*/
export async function readFileContents(input: { path: string }): Promise<{
    content: string;
}>;

/**
* Tool for getting the default address of a Coinbase wallet
* @param input - {
*   walletId?: string - The ID of the Coinbase wallet to get the address from
*
* @returns {
*   address: string;
* }
*/
export async function coinbaseMyAddressGetter(input: { walletId?: string }): Promise<{
    address: string;
}>;

/**
* Tool for restoring a Coinbase wallet and sending a transaction
* @param input - {
*   amount: string - The amount of tokens to send
*   assetId: string - The ID of the asset/token to send
*   recipient_address: string - The destination address for the transaction
*
* @returns {
*   status: string;
*   transactionHash: string;
*   transactionLink: string;
* }
*/
export async function coinbaseTransactionSender(input: { assetId: string, amount: string, recipient_address: string }): Promise<{
    status: string;
    transactionHash: string;
    transactionLink: string;
}>;

/**
* Tool for getting the transactions of a Coinbase wallet after restoring it
* @param input - {
*
* @returns {
*   columnsCount: number;
*   rowsCount: number;
*   tableCsv: string;
* }
*/
export async function coinbaseTransactionsGetter(input: {}): Promise<{
    columnsCount: number;
    rowsCount: number;
    tableCsv: string;
}>;

/**
* Sends an email using SMTP.
* @param input - {
*   body: string - The email body
*   recipient_email: string - The recipient's email address
*   subject: string - The email subject
*
* @returns {
*   message: string;
*   status: string;
* }
*/
export async function sendEmail(input: { recipient_email: string, subject: string, body: string }): Promise<{
    message: string;
    status: string;
}>;

/**
* Downloads a URL and converts its HTML content to Markdown
* @param input - {
*   url: string - A URL of a web page to download
*
* @returns {
*   markdown: string;
* }
*/
export async function downloadPages(input: { url: string }): Promise<{
    markdown: string;
}>;

/**
* Tool for calling a faucet on Coinbase
* @param input - {
*
* @returns {
*   data: string;
* }
*/
export async function coinbaseFaucetCaller(input: {}): Promise<{
    data: string;
}>;

/**
* This function takes a question as input and returns a comprehensive answer, along with the sources and statements used to generate the answer.
* @param input - {
*   query: string - The search query to look up
*
* @returns {
*   query: string;
*   results: object[];
* }
*/
export async function googleSearch(input: { query: string }): Promise<{
    query: string;
    results: object[];
}>;

/**
* Searches the web using Perplexity API (limited)
* @param input - {
*   query: string - The search query to send to Perplexity API
*
* @returns {
*   response: string;
* }
*/
export async function perplexityApi(input: { query: string }): Promise<{
    response: string;
}>;

//
// <tool_key_path_to_function_name>
// local:::__official_shinkai:::shinkai_typescript_unsafe_processor shinkaiTypescriptUnsafeProcessor
// local:::__official_shinkai:::shinkai_llm_map_reduce_processor shinkaiLlmMapReduceProcessor
// local:::__official_shinkai:::shinkai_llm_prompt_processor shinkaiLlmPromptProcessor
// local:::__official_shinkai:::shinkai_sqlite_query_executor shinkaiSqliteQueryExecutor
// local:::__official_shinkai:::shinkai_process_embeddings shinkaiProcessEmbeddings
// local:::__official_shinkai:::shinkai_tool_config_updater shinkaiToolConfigUpdater
// local:::__official_shinkai:::coinbase_balance_getter coinbaseBalanceGetter
// local:::__official_shinkai:::x_twitter_post xTwitterPost
// local:::__official_shinkai:::math_expression_evaluator mathExpressionEvaluator
// local:::__official_shinkai:::duckduckgo_search duckduckgoSearch
// local:::__official_shinkai:::memory_management memoryManagement
// local:::__official_shinkai:::write_file_contents writeFileContents
// local:::__official_shinkai:::email_answerer emailAnswerer
// local:::__official_shinkai:::meme_generator memeGenerator
// local:::__official_shinkai:::coinbase_wallet_creator coinbaseWalletCreator
// local:::__official_shinkai:::perplexity perplexity
// local:::__official_shinkai:::update_file_with_prompt updateFileWithPrompt
// local:::__official_shinkai:::youtube_transcript_summarizer youtubeTranscriptSummarizer
// local:::__official_shinkai:::smart_search_engine smartSearchEngine
// local:::__official_shinkai:::email_fetcher emailFetcher
// local:::__official_shinkai:::x_twitter_search xTwitterSearch
// local:::__official_shinkai:::read_file_contents readFileContents
// local:::__official_shinkai:::coinbase_my_address_getter coinbaseMyAddressGetter
// local:::__official_shinkai:::coinbase_transaction_sender coinbaseTransactionSender
// local:::__official_shinkai:::coinbase_transactions_getter coinbaseTransactionsGetter
// local:::__official_shinkai:::send_email sendEmail
// local:::__official_shinkai:::download_pages downloadPages
// local:::__official_shinkai:::coinbase_faucet_caller coinbaseFaucetCaller
// local:::__official_shinkai:::google_search googleSearch
// local:::__official_shinkai:::perplexity_api perplexityApi
// </tool_key_path_to_function_name>
//
