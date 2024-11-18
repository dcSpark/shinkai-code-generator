# RULE I:
* You may use any of the following functions if they are relevant and a good match for the task.
* Import them in the following way (do not rename functions with 'as'):
`import { xx } from '@shinkai/local-tools'`

* This is the content of '@shinkai/local-tools':
```typescript
/**
 * Echoes the input message
 * @param message - (required) 
 * @returns {{
 *   message: string 
 * }}
 */
export async function shinkaiEcho(message: string): Promise<{
    message: string;
}>;

/**
 * Get weather information for a city name
 * @param city - (required) 
 * @returns {{
 *   weather: string 
 * }}
 */
export async function shinkaiWeatherByCity(city: string): Promise<{
    weather: string;
}>;

/**
 * Fetches the price of a coin or token using Chainlink. It doesn't have many tokens.
 * @param symbol - (required) 
 * @returns {{
 *   symbol: string 
 *   price: number 
 * }}
 */
export async function shinkaiTokenPriceUsingChainlinkLimited(symbol: string): Promise<{
    symbol: string;
    price: number;
}>;

/**
 * Tool for requesting a loan on Aave, including selecting assets to supply and borrow with their APYs
 * @param inputValue - (required) 
 * @param assetSymbol - (required) 
 * @returns {{
 *   amountProcessed: string 
 * }}
 */
export async function shinkaiAaveLoanRequester(inputValue: string, assetSymbol: string): Promise<{
    amountProcessed: string;
}>;

/**
 * Runs the Leiden algorithm on the input edges
 * @param edges - (required) 
 * @param resolution - (optional) , default: undefined
 * @param nIterations - (optional) , default: undefined
 * @param nRandomStarts - (optional) , default: undefined
 * @param convergenceThreshold - (optional) , default: undefined
 * @returns {{
 *   bestClustering: object 
 *   bestLayout: object 
 * }}
 */
export async function shinkaiLeidenAlgorithm(edges: array, resolution?: number, nIterations?: number, nRandomStarts?: number, convergenceThreshold?: number): Promise<{
    bestClustering: object;
    bestLayout: object;
}>;

/**
 * Searches the DuckDuckGo search engine. Example result: [{"title": "IMDb Top 250 Movies", "description": "Find out which <b>movies</b> are rated as the <b>best</b> <b>of</b> <b>all</b> <b>time</b> by IMDb users. See the list of 250 titles sorted by ranking, genre, year, and rating, and learn how the list is determined.", "url": "https://www.imdb.com/chart/top/"}]
 * @param message - (required) 
 * @returns {{
 *   message: string 
 * }}
 */
export async function shinkaiDuckduckgoSearch(message: string): Promise<{
    message: string;
}>;

/**
 * Tool for getting the balance of a Coinbase wallet after restoring it
 * @param walletId - (optional) , default: undefined
 * @returns {{
 *   message: string 
 *   balances: object 
 * }}
 */
export async function shinkaiCoinbaseBalanceGetter(walletId?: string): Promise<{
    message: string;
    balances: object;
}>;

/**
 * Tool for getting the default address of a Coinbase wallet
 * @param walletId - (optional) , default: undefined
 * @returns {{
 *   address: string 
 * }}
 */
export async function shinkaiCoinbaseMyAddressGetter(walletId?: string): Promise<{
    address: string;
}>;

/**
 * Searches the internet using Perplexity
 * @param query - (required) 
 * @returns {{
 *   response: string 
 * }}
 */
export async function shinkaiPerplexity(query: string): Promise<{
    response: string;
}>;

/**
 * Fetches data on DeFi protocols by category (e.g., 'Liquid Staking', 'Lending', 'Bridge', 'Dexes', 'Restaking', 'Liquid Restaking', 'CDP', 'RWA', 'Yield', 'Derivatives', 'Farm', 'Yield Aggregator') and optionally filters by blockchain (e.g., 'Ethereum', 'Solana', 'Arbitrum', 'Base', 'Cardano', 'Near', 'BSC', 'Sui'). Returns protocol details including rank, name, TVL, TVL percentage changes, market cap to TVL ratio, and fees/revenue for the past 24 hours, 7 days, and 30 days.
 * @param top10 - (optional) , default: undefined
 * @param categoryName - (optional) , default: undefined
 * @param networkName - (optional) , default: undefined
 * @returns {{
 *   tableCsv: string 
 *   rowsCount: number 
 *   columnsCount: number 
 * }}
 */
export async function shinkaiDefillamaTvlRankings(top10?: boolean, categoryName?: string, networkName?: string): Promise<{
    tableCsv: string;
    rowsCount: number;
    columnsCount: number;
}>;

/**
 * New playwright-example tool from template
 * @param url - (required) 
 * @returns {{
 *   title: string 
 * }}
 */
export async function shinkaiPlaywrightExample(url: string): Promise<{
    title: string;
}>;

/**
 * Fetches the balance of an Ethereum address in ETH.
 * @param address - (required) 
 * @returns {{
 *   balance: string 
 * }}
 */
export async function shinkaiWeb3EthBalance(address: string): Promise<{
    balance: string;
}>;

/**
 * Tool for getting the transactions of a Coinbase wallet after restoring it
 * @returns {{
 *   tableCsv: string 
 *   rowsCount: number 
 *   columnsCount: number 
 * }}
 */
export async function shinkaiCoinbaseTransactionsGetter(): Promise<{
    tableCsv: string;
    rowsCount: number;
    columnsCount: number;
}>;

/**
 * Downloads one or more URLs and converts their HTML content to Markdown
 * @param urls - (required) 
 * @returns {{
 *   markdowns: string[] 
 * }}
 */
export async function shinkaiDownloadPages(urls: array): Promise<{
    markdowns: string[];
}>;

/**
 * Tool for creating a Coinbase wallet
 * @returns {{
 *   walletId: string 
 *   seed: string 
 *   address: string 
 * }}
 */
export async function shinkaiCoinbaseWalletCreator(): Promise<{
    walletId: string;
    seed: string;
    address: string;
}>;

/**
 * Summarizes a YouTube video. Provides a summary with organized sections and clickable timestamp links. Useful for quickly grasping main points, preparing for discussions, or efficient research. Example uses: summarizing tech talks, product reviews, or educational lectures. Parameters: url (string) - The full YouTube video URL to process.
 * @param url - (required, The full URL of the YouTube video to transcribe and summarize. Must be a valid and accessible YouTube video link.) 
 * @param lang - (optional, The language code for the transcript in ISO 639-1 format (e.g. "en" for English). Optional. If not specified, will use the default available transcript.) , default: undefined
 * @returns {{
 *   summary: string - A markdown-formatted summary of the video content, divided into sections with timestamp links to relevant parts of the video.
 * }}
 */
export async function shinkaiYoutubeVideoSummary(url: string, lang?: string): Promise<{
    summary: string;
}>;

/**
 * Searches the web using Perplexity API (limited)
 * @param query - (required) 
 * @returns {{
 *   response: string 
 * }}
 */
export async function shinkaiPerplexityApi(query: string): Promise<{
    response: string;
}>;

/**
 * Converts JSON to Markdown using a Nunjucks (Jinja2-like) template
 * @param message - (required) 
 * @param template - (required) 
 * @returns {{
 *   message: string 
 * }}
 */
export async function shinkaiJsonToMd(message: string, template: string): Promise<{
    message: string;
}>;

/**
 * Fetches the balance of an Ethereum address in ETH using Uniswap.
 * @param address - (required) 
 * @returns {{
 *   balance: string 
 * }}
 */
export async function shinkaiWeb3EthUniswap(address: string): Promise<{
    balance: string;
}>;

/**
 * Parses and evaluates mathematical expressions. It’s a safer and more math-oriented alternative to using JavaScript’s eval function for mathematical expressions.
 * @param expression - (required) 
 * @returns {{
 *   result: string 
 * }}
 */
export async function shinkaiMathExpressionEvaluator(expression: string): Promise<{
    result: string;
}>;

/**
 * Fetches the balance for an Ethereum EVM address like 0x123... and returns detailed token information. Example output: { "address": "0x123...", "ETH": { "balance": 1.23, "rawBalance": "12300000000000000000" }, "tokens": [ { "balance": 100, "rawBalance": "100000000000000000000", "tokenInfo": { "name": "TokenName", "symbol": "TKN", "decimals": "18" } } ] }
 * @param address - (required) 
 * @returns {{
 *   address: string 
 *   ETH: object 
 *   tokens: object[] 
 * }}
 */
export async function tokenBalanceForEvmEthereumAddressBasedOnEthplorer(address: string): Promise<{
    address: string;
    ETH: object;
    tokens: object[];
}>;

/**
 * Tool for calling a faucet on Coinbase
 * @returns {{
 *   data: string 
 * }}
 */
export async function shinkaiCoinbaseFaucetCaller(): Promise<{
    data: string;
}>;

/**
 * New foobar tool from template
 * @param message - (required) 
 * @returns {{
 *   message: string 
 * }}
 */
export async function shinkaiFoobar(message: string): Promise<{
    message: string;
}>;

/**
 * Tool for restoring a Coinbase wallet and sending a transaction
 * @param recipient_address - (required) 
 * @param assetId - (required) 
 * @param amount - (required) 
 * @returns {{
 *   transactionHash: string 
 *   transactionLink: string 
 *   status: string 
 * }}
 */
export async function shinkaiCoinbaseTransactionSender(recipient_address: string, assetId: string, amount: string): Promise<{
    transactionHash: string;
    transactionLink: string;
    status: string;
}>;

/**
 * Echoes the input message
 * @param message - (required) 
 * @returns {{
 * }}
 */
export async function networkEcho(message: string): Promise<{
}>;

/**
 * Takes a YouTube link and summarizes the content by creating multiple sections with a summary and a timestamp.
 * @param url - (required, The URL of the YouTube video) 
 * @returns {{
 * }}
 */
export async function youtubeTranscriptWithTimestamps(url: string): Promise<{
}>;

/**
 * Generic tool for processing any prompt using an LLM, analyzing the request and returning a string as output
 * @param prompt - (required, The prompt to process) 
 * @returns {{
 *   message: string 
 * }}
 */
export async function shinkaiLlmPromptProcessor(prompt: string): Promise<{
    message: string;
}>;

/**
 * Tool for executing SQLite queries on a specified database file. 
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
 * @param query - (required, The SQL query to execute) 
 * @returns {
 *   result: any 
 *   type: string 
 *   rowCount: number 
 *   rowsAffected: number 
 * }
 */
export async function shinkaiSqliteQueryExecutor(query: string): Promise<{
    result: any;
    type: string;
    rowCount: number;
    rowsAffected: number;
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
* Write a single implementation file.
* Implements the code in typescript for the following INPUT:


# INPUT:
