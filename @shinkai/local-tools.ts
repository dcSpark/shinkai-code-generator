import axios from 'npm:axios';

	 

/**

 * Fetches the balance of an Ethereum address in ETH.

 * @param address - (required) 

 * @returns {

 *   balance: string 

 * }

 */

async function shinkaiWeb3EthBalance(address: string): Promise<{

    balance: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_web3_eth_balance:::shinkai__web3_eth_balance',

        tool_type: 'deno',

        parameters: {

            address: address,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Fetches the balance of an Ethereum address in ETH using Uniswap.

 * @param address - (required) 

 * @returns {

 *   balance: string 

 * }

 */

async function shinkaiWeb3EthUniswap(address: string): Promise<{

    balance: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_web3_eth_uniswap:::shinkai__web3_eth_uniswap',

        tool_type: 'deno',

        parameters: {

            address: address,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Searches the DuckDuckGo search engine. Example result: [{"title": "IMDb Top 250 Movies", "description": "Find out which movies are rated as the best of all time by IMDb users. See the list of 250 titles sorted by ranking, genre, year, and rating, and learn how the list is determined.", "url": "https://www.imdb.com/chart/top/"}]

 * @param message - (required) 

 * @returns {

 *   message: string 

 * }

 */

async function shinkaiDuckduckgoSearch(message: string): Promise<{

    message: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_duckduckgo_search:::shinkai__duckduckgo_search',

        tool_type: 'deno',

        parameters: {

            message: message,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for getting the default address of a Coinbase wallet

 * @param walletId - (optional) , default: undefined

 * @returns {

 *   address: string 

 * }

 */

async function shinkaiCoinbaseMyAddressGetter(walletId?: string): Promise<{

    address: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_coinbase_get_my_address:::shinkai__coinbase_my_address_getter',

        tool_type: 'deno',

        parameters: {

            walletId: walletId,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Echoes the input message

 * @param message - (required) 

 * @returns {

 *   message: string 

 * }

 */

async function shinkaiEcho(message: string): Promise<{

    message: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_echo:::shinkai__echo',

        tool_type: 'deno',

        parameters: {

            message: message,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Get weather information for a city name

 * @param city - (required) 

 * @returns {

 *   weather: string 

 * }

 */

async function shinkaiWeatherByCity(city: string): Promise<{

    weather: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_weather_by_city:::shinkai__weather_by_city',

        tool_type: 'deno',

        parameters: {

            city: city,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for getting the balance of a Coinbase wallet after restoring it

 * @param walletId - (optional) , default: undefined

 * @returns {

 *   message: string 

 *   balances: object 

 * }

 */

async function shinkaiCoinbaseBalanceGetter(walletId?: string): Promise<{

    message: string;

    balances: object;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_coinbase_get_balance:::shinkai__coinbase_balance_getter',

        tool_type: 'deno',

        parameters: {

            walletId: walletId,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for restoring a Coinbase wallet and sending a transaction

 * @param recipient_address - (required) 

 * @param assetId - (required) 

 * @param amount - (required) 

 * @returns {

 *   transactionHash: string 

 *   transactionLink: string 

 *   status: string 

 * }

 */

async function shinkaiCoinbaseTransactionSender(recipient_address: string, assetId: string, amount: string): Promise<{

    transactionHash: string;

    transactionLink: string;

    status: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_coinbase_send_tx:::shinkai__coinbase_transaction_sender',

        tool_type: 'deno',

        parameters: {

            recipient_address: recipient_address,

            assetId: assetId,

            amount: amount,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Runs the Leiden algorithm on the input edges

 * @param edges - (required) 

 * @param resolution - (optional) , default: undefined

 * @param nIterations - (optional) , default: undefined

 * @param nRandomStarts - (optional) , default: undefined

 * @param convergenceThreshold - (optional) , default: undefined

 * @returns {

 *   bestClustering: object 

 *   bestLayout: object 

 * }

 */

async function shinkaiLeidenAlgorithm(edges: any[], resolution?: number, nIterations?: number, nRandomStarts?: number, convergenceThreshold?: number): Promise<{

    bestClustering: object;

    bestLayout: object;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_leiden:::shinkai__leiden_algorithm',

        tool_type: 'deno',

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

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for getting the transactions of a Coinbase wallet after restoring it

 * @returns {

 *   tableCsv: string 

 *   rowsCount: number 

 *   columnsCount: number 

 * }

 */

async function shinkaiCoinbaseTransactionsGetter(): Promise<{

    tableCsv: string;

    rowsCount: number;

    columnsCount: number;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_coinbase_get_transactions:::shinkai__coinbase_transactions_getter',

        tool_type: 'deno',

        parameters: {

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for calling a faucet on Coinbase

 * @returns {

 *   data: string 

 * }

 */

async function shinkaiCoinbaseFaucetCaller(): Promise<{

    data: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_coinbase_call_faucet:::shinkai__coinbase_faucet_caller',

        tool_type: 'deno',

        parameters: {

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Searches the internet using Perplexity

 * @param query - (required) 

 * @returns {

 *   response: string 

 * }

 */

async function shinkaiPerplexity(query: string): Promise<{

    response: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_perplexity:::shinkai__perplexity',

        tool_type: 'deno',

        parameters: {

            query: query,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Searches the web using Perplexity API (limited)

 * @param query - (required) 

 * @returns {

 *   response: string 

 * }

 */

async function shinkaiPerplexityApi(query: string): Promise<{

    response: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api',

        tool_type: 'deno',

        parameters: {

            query: query,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for requesting a loan on Aave, including selecting assets to supply and borrow with their APYs

 * @param inputValue - (required) 

 * @param assetSymbol - (required) 

 * @returns {

 *   amountProcessed: string 

 * }

 */

async function shinkaiAaveLoanRequester(inputValue: string, assetSymbol: string): Promise<{

    amountProcessed: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_aave_loan_requester:::shinkai__aave_loan_requester',

        tool_type: 'deno',

        parameters: {

            inputValue: inputValue,

            assetSymbol: assetSymbol,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Tool for creating a Coinbase wallet

 * @returns {

 *   walletId: string 

 *   seed: string 

 *   address: string 

 * }

 */

async function shinkaiCoinbaseWalletCreator(): Promise<{

    walletId: string;

    seed: string;

    address: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_coinbase_create_wallet:::shinkai__coinbase_wallet_creator',

        tool_type: 'deno',

        parameters: {

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Converts JSON to Markdown using a Nunjucks (Jinja2-like) template

 * @param message - (required) 

 * @param template - (required) 

 * @returns {

 *   message: string 

 * }

 */

async function shinkaiJsonToMd(message: string, template: string): Promise<{

    message: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_json_to_md:::shinkai__json_to_md',

        tool_type: 'deno',

        parameters: {

            message: message,

            template: template,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * New foobar tool from template

 * @param message - (required) 

 * @returns {

 *   message: string 

 * }

 */

async function shinkaiFoobar(message: string): Promise<{

    message: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_foobar:::shinkai__foobar',

        tool_type: 'deno',

        parameters: {

            message: message,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Downloads one or more URLs and converts their HTML content to Markdown

 * @param urls - (required) 

 * @returns {

 *   markdowns: string[] 

 * }

 */

async function shinkaiDownloadPages(urls: any[]): Promise<{

    markdowns: string[];

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_download_pages:::shinkai__download_pages',

        tool_type: 'deno',

        parameters: {

            urls: urls,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Parses and evaluates mathematical expressions. It’s a safer and more math-oriented alternative to using JavaScript’s eval function for mathematical expressions.

 * @param expression - (required) 

 * @returns {

 *   result: string 

 * }

 */

async function shinkaiMathExpressionEvaluator(expression: string): Promise<{

    result: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_math_exp:::shinkai__math_expression_evaluator',

        tool_type: 'deno',

        parameters: {

            expression: expression,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Fetches data on DeFi protocols by category (e.g., 'Liquid Staking', 'Lending', 'Bridge', 'Dexes', 'Restaking', 'Liquid Restaking', 'CDP', 'RWA', 'Yield', 'Derivatives', 'Farm', 'Yield Aggregator') and optionally filters by blockchain (e.g., 'Ethereum', 'Solana', 'Arbitrum', 'Base', 'Cardano', 'Near', 'BSC', 'Sui'). Returns protocol details including rank, name, TVL, TVL percentage changes, market cap to TVL ratio, and fees/revenue for the past 24 hours, 7 days, and 30 days.

 * @param top10 - (optional) , default: undefined

 * @param categoryName - (optional) , default: undefined

 * @param networkName - (optional) , default: undefined

 * @returns {

 *   tableCsv: string 

 *   rowsCount: number 

 *   columnsCount: number 

 * }

 */

async function shinkaiDefillamaTvlRankings(top10?: boolean, categoryName?: string, networkName?: string): Promise<{

    tableCsv: string;

    rowsCount: number;

    columnsCount: number;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_defillama_tvl_rankings:::shinkai__defillama_tvl_rankings',

        tool_type: 'deno',

        parameters: {

            top10: top10,

            categoryName: categoryName,

            networkName: networkName,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Fetches the price of a coin or token using Chainlink. It doesn't have many tokens.

 * @param symbol - (required) 

 * @returns {

 *   symbol: string 

 *   price: number 

 * }

 */

async function shinkaiTokenPriceUsingChainlinkLimited(symbol: string): Promise<{

    symbol: string;

    price: number;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_token_price:::shinkai__token_price_using_chainlink__limited_',

        tool_type: 'deno',

        parameters: {

            symbol: symbol,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * New playwright-example tool from template

 * @param url - (required) 

 * @returns {

 *   title: string 

 * }

 */

async function shinkaiPlaywrightExample(url: string): Promise<{

    title: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_playwright_example:::shinkai__playwright_example',

        tool_type: 'deno',

        parameters: {

            url: url,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Summarizes a YouTube video. Provides a summary with organized sections and clickable timestamp links. Useful for quickly grasping main points, preparing for discussions, or efficient research. Example uses: summarizing tech talks, product reviews, or educational lectures. Parameters: url (string) - The full YouTube video URL to process.

 * @param url - (required, The full URL of the YouTube video to transcribe and summarize. Must be a valid and accessible YouTube video link.) 

 * @param lang - (optional, The language code for the transcript in ISO 639-1 format (e.g. "en" for English). Optional. If not specified, will use the default available transcript.) , default: undefined

 * @returns {

 *   summary: string - A markdown-formatted summary of the video content, divided into sections with timestamp links to relevant parts of the video.

 * }

 */

async function shinkaiYoutubeVideoSummary(url: string, lang?: string): Promise<{

    summary: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_youtube_summary:::shinkai__youtube_video_summary',

        tool_type: 'deno',

        parameters: {

            url: url,

            lang: lang,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Fetches the balance for an Ethereum EVM address like 0x123... and returns detailed token information. Example output: { "address": "0x123...", "ETH": { "balance": 1.23, "rawBalance": "12300000000000000000" }, "tokens": [ { "balance": 100, "rawBalance": "100000000000000000000", "tokenInfo": { "name": "TokenName", "symbol": "TKN", "decimals": "18" } } ] }

 * @param address - (required) 

 * @returns {

 *   address: string 

 *   ETH: object 

 *   tokens: object[] 

 * }

 */

async function tokenBalanceForEvmEthereumAddressBasedOnEthplorer(address: string): Promise<{

    address: string;

    ETH: object;

    tokens: object[];

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::shinkai_tool_ethplorer_tokens:::token_balance_for_evm_ethereum_address___based_on_ethplorer',

        tool_type: 'deno',

        parameters: {

            address: address,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Echoes the input message

 * @param message - (required) 

 * @returns {

 * }

 */

async function networkEcho(message: string): Promise<{

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: '__agent_provider_arb_sep_shinkai:::shinkai_tool_echo:::network__echo',

        tool_type: 'network',

        parameters: {

            message: message,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Takes a YouTube link and summarizes the content by creating multiple sections with a summary and a timestamp.

 * @param url - (required, The URL of the YouTube video) 

 * @returns {

 * }

 */

async function youtubeTranscriptWithTimestamps(url: string): Promise<{

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: '__agent_provider_arb_sep_shinkai:::shinkai_tool_youtube_transcript:::youtube_transcript_with_timestamps',

        tool_type: 'network',

        parameters: {

            url: url,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

/**

 * Generic tool for processing any prompt using an LLM, analyzing the request and returning a string as output

 * @param prompt - (required, The prompt to process) 

 * @returns {

 *   message: string 

 * }

 */

async function shinkaiLlmPromptProcessor(prompt: string): Promise<{

    message: string;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::rust_toolkit:::shinkai_llm_prompt_processor',

        tool_type: 'rust',

        parameters: {

            prompt: prompt,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 

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

 * @param query_params - (optional, The parameters to bind to the query) , default: undefined

 * @returns {

 *   result: any 

 *   type: string 

 *   rowCount: number 

 *   rowsAffected: number 

 * }

 */

async function shinkaiSqliteQueryExecutor(query: string, query_params?: any[]): Promise<{

    result: any;

    type: string;

    rowCount: number;

    rowsAffected: number;

}> {

    const _url = 'http://localhost:9950/v2/tool_execution';

    const data = {

        llm_provider: 'llm_provider',

        tool_router_key: 'local:::rust_toolkit:::shinkai_sqlite_query_executor',

        tool_type: 'rust',

        parameters: {

            query: query,

            query_params: query_params,

        },

    };

    const response = await axios.post(_url, data, {

        headers: {

            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,

            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,

            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`

        }

    });

    return response.data.data;

}

 