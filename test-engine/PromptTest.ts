import { TestData } from "../types.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";

export type PromptTestResult = {
  prompt: string;
  raw: string;
  src: string | null;
};
export class PromptTest {
  constructor(
    private test: TestData,
    private model: BaseEngine,
  ) {}

  private async codePrompt(task: string) {
    return `${await Deno.readTextFile(
      `./results/${
        this.test.id?.toString().padStart(5, "0")
      }-${this.test.code}/${this.model.path}/raw-prompts/create-tool.md`,
    )}\n${task}\n`;
  }

  private async metadataPrompt(task: string) {
    return `${await Deno.readTextFile(
      `./results/${
        this.test.id?.toString().padStart(5, "0")
      }-${this.test.code}/${this.model.path}/raw-prompts/create-metadata.md`,
    )}\n${task}\n`;
  }

  private tryToExtractTS(text: string): string | null {
    const regex = /```(?:typescript)?\n([\s\S]+?)\n```/;
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  private tryToExtractJSON(text: string): string | null {
    const regex = /```(?:json)?\n([\s\S]+?)\n```/;
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  private async generateCode(task: string): Promise<PromptTestResult> {
    const codePrompt = await this.codePrompt(task);
    const raw = await this.model.run(codePrompt);
    const code = this.tryToExtractTS(raw);
    return { prompt: codePrompt, raw, src: code };
  }

  private async generateMetadata(code: string): Promise<PromptTestResult> {
    const metadataPrompt = await this.metadataPrompt(code);
    const raw = await this.model.run(metadataPrompt);
    const metadata = this.tryToExtractJSON(raw);
    return { prompt: metadataPrompt, raw, src: metadata };
  }

  private async augmentMetadata(command: string): Promise<string | null> {
    const prompt = `Given this signature:
\`\`\`typescript
export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT>
\`\`\`

1. Define the Typescript type for INPUTS
2. Define the Typescript type for OUTPUT

* Write only typescript code in a single code block
* Avoid all comments, text, notes and metadata.
* CONFIG is defined outside and cannot be changed.
* type INPUT = { /* keys */ }
* type OUTPUT = { /* keys */ }
* Keep only the minimum keys required to make the command viable.

For this command:
'''
${command}
'''
`;
    const raw = await this.model.run(prompt);
    return this.tryToExtractTS(raw);
  }

  private async selectTools(command: string): Promise<string> {
    const prompt = `Given this command:
'''
${command}
'''
* Only return a list of the function names from this list.
* Select the tools that are needed to execute the command from this list.

/**
 * Parses and evaluates mathematical expressions. It’s a safer and more math-oriented alternative to using JavaScript’s eval function for mathematical expressions.
 * @param expression - (required) 
 * @returns {
 *   result: string 
 * }
 */
export async function shinkaiMathExpressionEvaluator(expression: string): Promise<{
    result: string;
}>;

/**
 * Runs the Leiden algorithm on the input edges
 * @param convergenceThreshold - (optional) , default: undefined
 * @param edges - (required) 
 * @param nIterations - (optional) , default: undefined
 * @param nRandomStarts - (optional) , default: undefined
 * @param resolution - (optional) , default: undefined
 * @returns {
 *   bestClustering: object 
 *   bestLayout: object 
 * }
 */
export async function shinkaiLeidenAlgorithm(convergenceThreshold?: number, edges: any[], nIterations?: number, nRandomStarts?: number, resolution?: number): Promise<{
    bestClustering: object;
    bestLayout: object;
}>;

/**
 * Fetches the balance for an Ethereum EVM address like 0x123... and returns detailed token information. Example output: { "address": "0x123...", "ETH": { "balance": 1.23, "rawBalance": "12300000000000000000" }, "tokens": [ { "balance": 100, "rawBalance": "100000000000000000000", "tokenInfo": { "name": "TokenName", "symbol": "TKN", "decimals": "18" } } ] }
 * @param address - (required) 
 * @returns {
 *   ETH: object 
 *   address: string 
 *   tokens: object[] 
 * }
 */
export async function tokenBalanceForEvmEthereumAddressBasedOnEthplorer(address: string): Promise<{
    ETH: object;
    address: string;
    tokens: object[];
}>;

/**
 * Tool for creating a Coinbase wallet
 * @returns {
 *   address: string 
 *   seed: string 
 *   walletId: string 
 * }
 */
export async function shinkaiCoinbaseWalletCreator(): Promise<{
    address: string;
    seed: string;
    walletId: string;
}>;

/**
 * Searches the DuckDuckGo search engine. Example result: [{"title": "IMDb Top 250 Movies", "description": "Find out which <b>movies</b> are rated as the <b>best</b> <b>of</b> <b>all</b> <b>time</b> by IMDb users. See the list of 250 titles sorted by ranking, genre, year, and rating, and learn how the list is determined.", "url": "https://www.imdb.com/chart/top/"}]
 * @param message - (required) 
 * @returns {
 *   message: string 
 * }
 */
export async function shinkaiDuckduckgoSearch(message: string): Promise<{
    message: string;
}>;

/**
 * Tool for getting the transactions of a Coinbase wallet after restoring it
 * @returns {
 *   columnsCount: number 
 *   rowsCount: number 
 *   tableCsv: string 
 * }
 */
export async function shinkaiCoinbaseTransactionsGetter(): Promise<{
    columnsCount: number;
    rowsCount: number;
    tableCsv: string;
}>;

/**
 * Searches the internet using Perplexity
 * @param query - (required) 
 * @returns {
 *   response: string 
 * }
 */
export async function shinkaiPerplexity(query: string): Promise<{
    response: string;
}>;

/**
 * Summarizes a YouTube video. Provides a summary with organized sections and clickable timestamp links. Useful for quickly grasping main points, preparing for discussions, or efficient research. Example uses: summarizing tech talks, product reviews, or educational lectures. Parameters: url (string) - The full YouTube video URL to process.
 * @param lang - (optional, The language code for the transcript in ISO 639-1 format (e.g. "en" for English). Optional. If not specified, will use the default available transcript.) , default: undefined
 * @param url - (required, The full URL of the YouTube video to transcribe and summarize. Must be a valid and accessible YouTube video link.) 
 * @returns {
 *   summary: string - A markdown-formatted summary of the video content, divided into sections with timestamp links to relevant parts of the video.
 * }
 */
export async function shinkaiYoutubeVideoSummary(lang?: string, url: string): Promise<{
    summary: string;
}>;

/**
 * Tool for calling a faucet on Coinbase
 * @returns {
 *   data: string 
 * }
 */
export async function shinkaiCoinbaseFaucetCaller(): Promise<{
    data: string;
}>;

/**
 * Converts JSON to Markdown using a Nunjucks (Jinja2-like) template
 * @param message - (required) 
 * @param template - (required) 
 * @returns {
 *   message: string 
 * }
 */
export async function shinkaiJsonToMd(message: string, template: string): Promise<{
    message: string;
}>;

/**
 * Fetches the price of a coin or token using Chainlink. It doesn't have many tokens.
 * @param symbol - (required) 
 * @returns {
 *   price: number 
 *   symbol: string 
 * }
 */
export async function shinkaiTokenPriceUsingChainlinkLimited(symbol: string): Promise<{
    price: number;
    symbol: string;
}>;

/**
 * Tool for requesting a loan on Aave, including selecting assets to supply and borrow with their APYs
 * @param assetSymbol - (required) 
 * @param inputValue - (required) 
 * @returns {
 *   amountProcessed: string 
 * }
 */
export async function shinkaiAaveLoanRequester(assetSymbol: string, inputValue: string): Promise<{
    amountProcessed: string;
}>;

/**
 * Tool for restoring a Coinbase wallet and sending a transaction
 * @param amount - (required) 
 * @param assetId - (required) 
 * @param recipient_address - (required) 
 * @returns {
 *   status: string 
 *   transactionHash: string 
 *   transactionLink: string 
 * }
 */
export async function shinkaiCoinbaseTransactionSender(amount: string, assetId: string, recipient_address: string): Promise<{
    status: string;
    transactionHash: string;
    transactionLink: string;
}>;

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
 * Fetches the balance of an Ethereum address in ETH using Uniswap.
 * @param address - (required) 
 * @returns {
 *   balance: string 
 * }
 */
export async function shinkaiWeb3EthUniswap(address: string): Promise<{
    balance: string;
}>;

/**
 * Echoes the input message
 * @param message - (required) 
 * @returns {
 *   message: string 
 * }
 */
export async function shinkaiEcho(message: string): Promise<{
    message: string;
}>;

/**
 * Get weather information for a city name
 * @param city - (required) 
 * @returns {
 *   weather: string 
 * }
 */
export async function shinkaiWeatherByCity(city: string): Promise<{
    weather: string;
}>;

/**
 * Fetches data on DeFi protocols by category (e.g., 'Liquid Staking', 'Lending', 'Bridge', 'Dexes', 'Restaking', 'Liquid Restaking', 'CDP', 'RWA', 'Yield', 'Derivatives', 'Farm', 'Yield Aggregator') and optionally filters by blockchain (e.g., 'Ethereum', 'Solana', 'Arbitrum', 'Base', 'Cardano', 'Near', 'BSC', 'Sui'). Returns protocol details including rank, name, TVL, TVL percentage changes, market cap to TVL ratio, and fees/revenue for the past 24 hours, 7 days, and 30 days.
 * @param categoryName - (optional) , default: undefined
 * @param networkName - (optional) , default: undefined
 * @param top10 - (optional) , default: undefined
 * @returns {
 *   columnsCount: number 
 *   rowsCount: number 
 *   tableCsv: string 
 * }
 */
export async function shinkaiDefillamaTvlRankings(categoryName?: string, networkName?: string, top10?: boolean): Promise<{
    columnsCount: number;
    rowsCount: number;
    tableCsv: string;
}>;

/**
 * Searches the web using Perplexity API (limited)
 * @param query - (required) 
 * @returns {
 *   response: string 
 * }
 */
export async function shinkaiPerplexityApi(query: string): Promise<{
    response: string;
}>;

/**
 * Fetches the balance of an Ethereum address in ETH.
 * @param address - (required) 
 * @returns {
 *   balance: string 
 * }
 */
export async function shinkaiWeb3EthBalance(address: string): Promise<{
    balance: string;
}>;

/**
 * Tool for getting the balance of a Coinbase wallet after restoring it
 * @param walletId - (optional) , default: undefined
 * @returns {
 *   balances: object 
 *   message: string 
 * }
 */
export async function shinkaiCoinbaseBalanceGetter(walletId?: string): Promise<{
    balances: object;
    message: string;
}>;

/**
 * New foobar tool from template
 * @param message - (required) 
 * @returns {
 *   message: string 
 * }
 */
export async function shinkaiFoobar(message: string): Promise<{
    message: string;
}>;

/**
 * Tool for getting the default address of a Coinbase wallet
 * @param walletId - (optional) , default: undefined
 * @returns {
 *   address: string 
 * }
 */
export async function shinkaiCoinbaseMyAddressGetter(walletId?: string): Promise<{
    address: string;
}>;

/**
 * New playwright-example tool from template
 * @param url - (required) 
 * @returns {
 *   title: string 
 * }
 */
export async function shinkaiPlaywrightExample(url: string): Promise<{
    title: string;
}>;

/**
 * Echoes the input message
 * @param message - (required) 
 * @returns {
 * }
 */
export async function networkEcho(message: string): Promise<{
}>;

/**
 * Takes a YouTube link and summarizes the content by creating multiple sections with a summary and a timestamp.
 * @param url - (required, The URL of the YouTube video) 
 * @returns {
 * }
 */
export async function youtubeTranscriptWithTimestamps(url: string): Promise<{
}>;

/**
 * Tool for processing any prompt using an AI LLM. 
Analyzing the input prompt and returning a string with the result of the prompt.
This can be used to process complex requests, text analysis, text matching, text generation, and any other AI LLM task.
 * @param format - (required, The output format. Only 'text' is supported) 
 * @param prompt - (required, The prompt to process) 
 * @returns {
 *   message: string 
 * }
 */
export async function shinkaiLlmPromptProcessor(format: string, prompt: string): Promise<{
    message: string;
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
`;
    const raw = await this.model.run(prompt);
    return raw;
  }

  public async run(): Promise<
    { code: PromptTestResult; metadata: PromptTestResult | null }
  > {
    // const toolsSelected = await this.selectTools(this.test.prompt);
    // Deno.writeTextFile(
    //   `./results/${
    //     this.test.id?.toString().padStart(5, "0")
    //   }-${this.test.code}/${this.model.path}/tools-selected.txt`,
    //   toolsSelected || "",
    // );
    // const metadataAugmented = await this.augmentMetadata(this.test.prompt);
    // Deno.writeTextFile(
    //   `./results/${
    //     this.test.id?.toString().padStart(5, "0")
    //   }-${this.test.code}/${this.model.path}/metadata-augmented.txt`,
    //   metadataAugmented || "",
    // );

    const code = await this.generateCode(
      this.test.prompt +
        (this.test.sql_store ? ` and store the result in SQL.` : "") + 
        " Given " + this.test.prompt_type
    );

    const metadata = code.src ? await this.generateMetadata(code.src) : null;
    return { code, metadata };
  }
}
