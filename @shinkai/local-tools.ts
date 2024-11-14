import axios from "npm:axios";
const BEARER = Deno.env.get("BEARER");
if (!BEARER) {
  throw new Error("BEARER is not set");
}
/**

 * Echoes the input message

 * @param message - (required)

 * @returns {{

 *   message: string

 * }}

 */

export async function shinkaiEcho(message: string): Promise<{
  message: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key: "local:::shinkai-tool-echo:::shinkai__echo",

    tool_type: "deno",

    parameters: {
      message: message,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Get weather information for a city name

 * @param city - (required)

 * @returns {{

 *   weather: string

 * }}

 */

export async function shinkaiWeatherByCity(city: string): Promise<{
  weather: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-weather-by-city:::shinkai__weather_by_city",

    tool_type: "deno",

    parameters: {
      city: city,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Fetches the price of a coin or token using Chainlink. It doesn't have many tokens.

 * @param symbol - (required)

 * @returns {{

 *   symbol: string

 *   price: number

 * }}

 */

export async function shinkaiTokenPriceUsingChainlinkLimited(
  symbol: string,
): Promise<{
  symbol: string;

  price: number;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-token-price:::shinkai__token_price_using_chainlink__limited_",

    tool_type: "deno",

    parameters: {
      symbol: symbol,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Tool for requesting a loan on Aave, including selecting assets to supply and borrow with their APYs

 * @param inputValue - (required)

 * @param assetSymbol - (required)

 * @returns {{

 *   amountProcessed: string

 * }}

 */

export async function shinkaiAaveLoanRequester(
  inputValue: string,
  assetSymbol: string,
): Promise<{
  amountProcessed: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-aave-loan-requester:::shinkai__aave_loan_requester",

    tool_type: "deno",

    parameters: {
      inputValue: inputValue,

      assetSymbol: assetSymbol,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

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

export async function shinkaiLeidenAlgorithm(
  edges: array,
  resolution?: number,
  nIterations?: number,
  nRandomStarts?: number,
  convergenceThreshold?: number,
): Promise<{
  bestClustering: object;

  bestLayout: object;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key: "local:::shinkai-tool-leiden:::shinkai__leiden_algorithm",

    tool_type: "deno",

    parameters: {
      edges: edges,

      resolution: resolution,

      nIterations: nIterations,

      nRandomStarts: nRandomStarts,

      convergenceThreshold: convergenceThreshold,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Searches the DuckDuckGo search engine. Example result: [{"title": "IMDb Top 250 Movies", "description": "Find out which movies are rated as the best of all time by IMDb users. See the list of 250 titles sorted by ranking, genre, year, and rating, and learn how the list is determined.", "url": "https://www.imdb.com/chart/top/"}]

 * @param message - (required)

 * @returns {{

 *   message: string

 * }}

 */

export async function shinkaiDuckduckgoSearch(message: string): Promise<{
  message: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-duckduckgo-search:::shinkai__duckduckgo_search",

    tool_type: "deno",

    parameters: {
      message: message,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

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
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-coinbase-get-balance:::shinkai__coinbase_balance_getter",

    tool_type: "deno",

    parameters: {
      walletId: walletId,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Tool for getting the default address of a Coinbase wallet

 * @param walletId - (optional) , default: undefined

 * @returns {{

 *   address: string

 * }}

 */

export async function shinkaiCoinbaseMyAddressGetter(
  walletId?: string,
): Promise<{
  address: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-coinbase-get-my-address:::shinkai__coinbase_my_address_getter",

    tool_type: "deno",

    parameters: {
      walletId: walletId,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Searches the internet using Perplexity

 * @param query - (required)

 * @returns {{

 *   response: string

 * }}

 */

export async function shinkaiPerplexity(query: string): Promise<{
  response: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key: "local:::shinkai-tool-perplexity:::shinkai__perplexity",

    tool_type: "deno",

    parameters: {
      query: query,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

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

export async function shinkaiDefillamaTvlRankings(
  top10?: boolean,
  categoryName?: string,
  networkName?: string,
): Promise<{
  tableCsv: string;

  rowsCount: number;

  columnsCount: number;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-defillama-tvl-rankings:::shinkai__defillama-tvl-rankings",

    tool_type: "deno",

    parameters: {
      top10: top10,

      categoryName: categoryName,

      networkName: networkName,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * New playwright-example tool from template

 * @param url - (required)

 * @returns {{

 *   title: string

 * }}

 */

export async function shinkaiPlaywrightExample(url: string): Promise<{
  title: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-playwright-example:::shinkai__playwright-example",

    tool_type: "deno",

    parameters: {
      url: url,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Fetches the balance of an Ethereum address in ETH.

 * @param address - (required)

 * @returns {{

 *   balance: string

 * }}

 */

export async function shinkaiWeb3EthBalance(address: string): Promise<{
  balance: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-web3-eth-balance:::shinkai__web3_eth_balance",

    tool_type: "deno",

    parameters: {
      address: address,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

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
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-coinbase-get-transactions:::shinkai__coinbase_transactions_getter",

    tool_type: "deno",

    parameters: {},
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Downloads one or more URLs and converts their HTML content to Markdown

 * @param urls - (required)

 * @returns {{

 *   markdowns: string[]

 * }}

 */

export async function shinkaiDownloadPages(urls: array): Promise<{
  markdowns: string[];
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-download-pages:::shinkai__download_pages",

    tool_type: "deno",

    parameters: {
      urls: urls,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

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
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-coinbase-create-wallet:::shinkai__coinbase_wallet_creator",

    tool_type: "deno",

    parameters: {},
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Summarizes a YouTube video. Provides a summary with organized sections and clickable timestamp links. Useful for quickly grasping main points, preparing for discussions, or efficient research. Example uses: summarizing tech talks, product reviews, or educational lectures. Parameters: url (string) - The full YouTube video URL to process.

 * @param url - (required, The full URL of the YouTube video to transcribe and summarize. Must be a valid and accessible YouTube video link.)

 * @param lang - (optional, The language code for the transcript in ISO 639-1 format (e.g. "en" for English). Optional. If not specified, will use the default available transcript.) , default: undefined

 * @returns {{

 *   summary: string - A markdown-formatted summary of the video content, divided into sections with timestamp links to relevant parts of the video.

 * }}

 */

export async function shinkaiYoutubeVideoSummary(
  url: string,
  lang?: string,
): Promise<{
  summary: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-youtube-summary:::shinkai__youtube_video_summary",

    tool_type: "deno",

    parameters: {
      url: url,

      lang: lang,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Searches the web using Perplexity API (limited)

 * @param query - (required)

 * @returns {{

 *   response: string

 * }}

 */

export async function shinkaiPerplexityApi(query: string): Promise<{
  response: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-perplexity-api:::shinkai__perplexity_api",

    tool_type: "deno",

    parameters: {
      query: query,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Converts JSON to Markdown using a Nunjucks (Jinja2-like) template

 * @param message - (required)

 * @param template - (required)

 * @returns {{

 *   message: string

 * }}

 */

export async function shinkaiJsonToMd(
  message: string,
  template: string,
): Promise<{
  message: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key: "local:::shinkai-tool-json-to-md:::shinkai__json-to-md",

    tool_type: "deno",

    parameters: {
      message: message,

      template: template,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Fetches the balance of an Ethereum address in ETH using Uniswap.

 * @param address - (required)

 * @returns {{

 *   balance: string

 * }}

 */

export async function shinkaiWeb3EthUniswap(address: string): Promise<{
  balance: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-web3-eth-uniswap:::shinkai__web3_eth_uniswap",

    tool_type: "deno",

    parameters: {
      address: address,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Parses and evaluates mathematical expressions. It’s a safer and more math-oriented alternative to using JavaScript’s eval function for mathematical expressions.

 * @param expression - (required)

 * @returns {{

 *   result: string

 * }}

 */

export async function shinkaiMathExpressionEvaluator(
  expression: string,
): Promise<{
  result: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-math-exp:::shinkai__math_expression_evaluator",

    tool_type: "deno",

    parameters: {
      expression: expression,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Fetches the balance for an Ethereum EVM address like 0x123... and returns detailed token information. Example output: { "address": "0x123...", "ETH": { "balance": 1.23, "rawBalance": "12300000000000000000" }, "tokens": [ { "balance": 100, "rawBalance": "100000000000000000000", "tokenInfo": { "name": "TokenName", "symbol": "TKN", "decimals": "18" } } ] }

 * @param address - (required)

 * @returns {{

 *   address: string

 *   ETH: object

 *   tokens: object[]

 * }}

 */

export async function tokenBalanceForEvmEthereumAddressBasedOnEthplorer(
  address: string,
): Promise<{
  address: string;

  ETH: object;

  tokens: object[];
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-ethplorer-tokens:::token_balance_for_evm_ethereum_address_-_based_on_ethplorer",

    tool_type: "deno",

    parameters: {
      address: address,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Tool for calling a faucet on Coinbase

 * @returns {{

 *   data: string

 * }}

 */

export async function shinkaiCoinbaseFaucetCaller(): Promise<{
  data: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-coinbase-call-faucet:::shinkai__coinbase_faucet_caller",

    tool_type: "deno",

    parameters: {},
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * New foobar tool from template

 * @param message - (required)

 * @returns {{

 *   message: string

 * }}

 */

export async function shinkaiFoobar(message: string): Promise<{
  message: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key: "local:::shinkai-tool-foobar:::shinkai__foobar",

    tool_type: "deno",

    parameters: {
      message: message,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

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

export async function shinkaiCoinbaseTransactionSender(
  recipient_address: string,
  assetId: string,
  amount: string,
): Promise<{
  transactionHash: string;

  transactionLink: string;

  status: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "local:::shinkai-tool-coinbase-send-tx:::shinkai__coinbase_transaction_sender",

    tool_type: "deno",

    parameters: {
      recipient_address: recipient_address,

      assetId: assetId,

      amount: amount,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Echoes the input message

 * @param message - (required)

 * @returns {{

 * }}

 */

export async function networkEcho(message: string): Promise<{}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "@@agent_provider.arb-sep-shinkai:::shinkai-tool-echo:::network__echo",

    tool_type: "network",

    parameters: {
      message: message,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Takes a YouTube link and summarizes the content by creating multiple sections with a summary and a timestamp.

 * @param url - (required, The URL of the YouTube video)

 * @returns {{

 * }}

 */

export async function youtubeTranscriptWithTimestamps(
  url: string,
): Promise<{}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key:
      "@@agent_provider.arb-sep-shinkai:::shinkai-tool-youtube-transcript:::youtube_transcript_with_timestamps",

    tool_type: "network",

    parameters: {
      url: url,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}

/**

 * Generic tool for processing any prompt using an LLM, analyzing the request and returning a string as output

 * @param prompt - (required, The prompt to process)

 * @returns {{

 *   message: string

 * }}

 */

export async function shinkaiLlmPromptProcessor(prompt: string): Promise<{
  message: string;
}> {
  const _url = "http://localhost:9950/v2/tool_execution";

  const data = {
    tool_router_key: "local:::shinkai_custom:::llm_prompt_processor",

    tool_type: "internal",

    parameters: {
      prompt: prompt,
    },
  };

  const response = await axios.post(_url, data, {
    headers: {
      "Authorization": `Bearer ${BEARER}`,
    },
  });

  return response.data;
}
