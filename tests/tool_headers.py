
async def shinkai_typescript_unsafe_processor(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for executing Node.js code. This is unsafe and should be used with extreme caution.

    Args:
        input: Dict[str, Any]:
            package: str (required) - The package.json contents
            code: str (required) - The TypeScript code to execute
            parameters: Dict[str, Any] (required) - Parameters to pass to the code
            config: Dict[str, Any] (required) - Configuration for the code execution

    Returns:
        Dict[str, Any]: {
            stdout: str
        }
    """
    pass
async def shinkai_llm_map_reduce_processor(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for applying a prompt over a long text (longer than the context window of the LLM) using an AI LLM.
This can be used to process complex requests, text analysis, text matching, text generation, and any other AI LLM task. over long texts.

    Args:
        input: Dict[str, Any]:
            prompt: str (required) - The prompt to apply over the data
            data: str (required) - The data to process
            tools: List[Any] (optional) - List of tools names or tool router keys to be used with the prompt

    Returns:
        Dict[str, Any]: {
            response: str
        }
    """
    pass
async def shinkai_llm_prompt_processor(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for processing any prompt using an AI LLM.
Analyzing the input prompt and returning a string with the result of the prompt.
This can be used to process complex requests, text analysis, text matching, text generation, and any other AI LLM task.

    Args:
        input: Dict[str, Any]:
            tools: List[Any] (optional) - List of tools names or tool router keys to be used with the prompt
            prompt: str (required) - The prompt to process
            format: str (required) - Response type. The only valid option is 'text'

    Returns:
        Dict[str, Any]: {
            message: str
        }
    """
    pass
async def shinkai_sqlite_query_executor(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for executing a single SQL query on a specified database file.
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

    Args:
        input: Dict[str, Any]:
            params: List[Any] (optional) - The parameters to pass to the query
            query: str (required) - The SQL query to execute

    Returns:
        Dict[str, Any]: {
            result: Any
            rowCount: float
            rowsAffected: float
            type: str
        }
    """
    pass
async def shinkai_process_embeddings(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for processing embeddings within a job scope.
This tool processes resources and generates embeddings using a specified mapping function.

Example usage:
- Provide a custom mapping function to transform resource content.
- Process resources in chunks to optimize performance.
- Collect and join processed embeddings for further analysis.

    Args:
        input: Dict[str, Any]:
            map_function: str (optional) - The map function to use
            prompt: str (required) - The prompt to use

    Returns:
        Dict[str, Any]: {
            result: str
            rowCount: float
            rowsAffected: float
            type: str
        }
    """
    pass
async def shinkai_tool_config_updater(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for updating the configuration of a tool.
This tool allows you to update config fields of a tool by providing the tool_router_key and config key-value pairs.

Example usage:
{
    "tool_router_key": "local:::deno_toolkit:::my_tool",
    "config": {
            "api_key": "some-api-key",
            "api_secret": "some-api-secret"
    }
}

    Args:
        input: Dict[str, Any]:
            tool_router_key: str (required) - The tool_router_key of the tool to update
            config: Dict[str, Any] (required) - Configuration key-value pairs to update

    Returns:
        Dict[str, Any]: {
            message: str
            success: bool
        }
    """
    pass
async def coinbase_balance_getter(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for getting the balance of a Coinbase wallet after restoring it

    Args:
        input: Dict[str, Any]:
            walletId: str (optional) - Optional wallet ID to get balance for a specific wallet

    Returns:
        Dict[str, Any]: {
            balances: Dict[str, Any] - Map of token symbols to their respective balances
            message: str - Status message about the balance retrieval operation
        }
    """
    pass
async def x_twitter_post(input: Dict[str, Any]) -> Dict[str, Any]:
    """Function to post a tweet to Twitter.

    Args:
        input: Dict[str, Any]:
            text: str (optional) - Message to post
            imagePath: str (optional) - Path to the image to post

    Returns:
        Dict[str, Any]: {
            data: str - The data returned by the Twitter API
        }
    """
    pass
async def math_expression_evaluator(input: Dict[str, Any]) -> Dict[str, Any]:
    """Parses and evaluates mathematical expressions. It’s a safer and more math-oriented alternative to using JavaScript’s eval function for mathematical expressions.

    Args:
        input: Dict[str, Any]:
            expression: str (required) - The mathematical expression to evaluate (e.g., '2 + 2 * 3')

    Returns:
        Dict[str, Any]: {
            result: str - The evaluated result of the mathematical expression
        }
    """
    pass
async def duck_duck_go_search(input: Dict[str, Any]) -> Dict[str, Any]:
    """Searches the DuckDuckGo search engine. Example result: [{"title": "IMDb Top 250 Movies", "description": "Find out which <b>movies</b> are rated as the <b>best</b> <b>of</b> <b>all</b> <b>time</b> by IMDb users. See the list of 250 titles sorted by ranking, genre, year, and rating, and learn how the list is determined.", "url": "https://www.imdb.com/chart/top/"}]

    Args:
        input: Dict[str, Any]:
            message: str (required) - The search query to send to DuckDuckGo

    Returns:
        Dict[str, Any]: {
            message: str - The search results from DuckDuckGo in JSON format, containing title, description, and URL for each result
            puppeteer: bool - Whether the search was performed using Puppeteer
        }
    """
    pass
async def memory_management(input: Dict[str, Any]) -> Dict[str, Any]:
    """Handles memory storage and retrieval using a SQLite database.

    Args:
        input: Dict[str, Any]:
            general_prompt: str (optional) - The general prompt for generating memories
            specific_prompt: str (optional) - The specific prompt for generating memories
            data: str (optional) - The data to process for memory management, if not provided, the tool will return existing memories
            key: str (optional) - The key for specific memory retrieval

    Returns:
        Dict[str, Any]: {
            generalMemory: str - The updated general memory
            specificMemory: str - The updated specific memory
        }
    """
    pass
async def write_file_contents(input: Dict[str, Any]) -> Dict[str, Any]:
    """Writes the text contents of a file to the given path.

    Args:
        input: Dict[str, Any]:
            content: str (required) - The content to write to the file.
            path: str (required) - The path of the file to write to.

    Returns:
        Dict[str, Any]: {
            message: str - The message returned from the operation.
        }
    """
    pass
async def email_answerer(input: Dict[str, Any]) -> Dict[str, Any]:
    """Generates responses to emails based on a given context and memory, and logs answered emails in a database.

    Args:
        input: Dict[str, Any]:
            to_date: str (optional) - The ending date for fetching emails in DD-Mon-YYYY format
            from_date: str (optional) - The starting date for fetching emails in DD-Mon-YYYY format

    Returns:
        Dict[str, Any]: {
            login_status: str - The status of the email login
            mail_ids: List[str] - The list of generated unique mail IDs
            skipped: List[str] - List of email IDs that were skipped
            table_created: bool - Indicates if the email logging table was created
        }
    """
    pass
async def meme_generator(input: Dict[str, Any]) -> Dict[str, Any]:
    """Generates a meme image based on a joke by selecting a template and splitting the joke into appropriate parts.

    Args:
        input: Dict[str, Any]:
            joke: str (required) - The joke to create the meme from

    Returns:
        Dict[str, Any]: {
            memeUrl: str - The URL of the generated meme image
        }
    """
    pass
async def coinbase_wallet_creator(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for creating a Coinbase wallet

    Args:
        input: Dict[str, Any]:

    Returns:
        Dict[str, Any]: {
            address: str
            seed: str
            walletId: str
        }
    """
    pass
async def perplexity(input: Dict[str, Any]) -> Dict[str, Any]:
    """Searches the internet using Perplexity

    Args:
        input: Dict[str, Any]:
            query: str (required) - The search query to send to Perplexity

    Returns:
        Dict[str, Any]: {
            response: str - The search results and analysis from Perplexity
        }
    """
    pass
async def update_file_with_prompt(input: Dict[str, Any]) -> Dict[str, Any]:
    """Applies a prompt to the file contents.

    Args:
        input: Dict[str, Any]:
            prompt: str (required) - The prompt to apply to the file contents.
            path: str (required) - The path of the file to update.

    Returns:
        Dict[str, Any]: {
            message: str - The message returned from the tool.
            new_file_content: str - The path of the file that was updated.
        }
    """
    pass
async def youtube_transcript_summarizer(input: Dict[str, Any]) -> Dict[str, Any]:
    """Fetches the transcript of a YouTube video and generates a formatted summary using an LLM.

    Args:
        input: Dict[str, Any]:
            lang: str (optional) - The language for the transcript (optional)
            url: str (required) - The URL of the YouTube video

    Returns:
        Dict[str, Any]: {
            summary: str - The generated summary of the video
        }
    """
    pass
async def smart_search_engine(input: Dict[str, Any]) -> Dict[str, Any]:
    """This function takes a question as input and returns a comprehensive answer, along with the sources and statements used to generate the answer.

    Args:
        input: Dict[str, Any]:
            question: str (required) - The question to answer

    Returns:
        Dict[str, Any]: {
            response: str - The generated answer
            sources: List[Dict[str, Any]] - The sources used to generate the answer
            statements: List[Dict[str, Any]] - The statements extracted from the sources
        }
    """
    pass
async def email_fetcher(input: Dict[str, Any]) -> Dict[str, Any]:
    """Fetches emails from an IMAP server and returns their subject, date, sender, and text content.

    Args:
        input: Dict[str, Any]:
            to_date: str (optional) - The end date for the email search (optional)
            from_date: str (optional) - The start date for the email search (optional)

    Returns:
        Dict[str, Any]: {
            emails: List[Dict[str, Any]] - A list of email objects
            login_status: str - Indicates if login was successful or not
        }
    """
    pass
async def x_twitter_search(input: Dict[str, Any]) -> Dict[str, Any]:
    """Fetch from X/Twitter API to perform various search and retrieval operations.

    Args:
        input: Dict[str, Any]:
            tweetId: str (optional) - The ID of the tweet to retrieve
            username: str (optional) - The username for retrieving user posts
            searchQuery: str (optional) - The search query for fetching tweets
            command: str (required) - The exact command to execute: 'search-top' | 'search-suggestions' | 'search-latest' | 'get-user-posts' | 'get-post-by-id'

    Returns:
        Dict[str, Any]: {
            data: Dict[str, Any] - The data returned from the Twitter API
        }
    """
    pass
async def read_file_contents(input: Dict[str, Any]) -> Dict[str, Any]:
    """Reads the text contents of a file from the given path.

    Args:
        input: Dict[str, Any]:
            path: str (required) - The path of the file to read.

    Returns:
        Dict[str, Any]: {
            content: str - The content of the file.
        }
    """
    pass
async def coinbase_my_address_getter(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for getting the default address of a Coinbase wallet

    Args:
        input: Dict[str, Any]:
            walletId: str (optional) - The ID of the Coinbase wallet to get the address from

    Returns:
        Dict[str, Any]: {
            address: str - The Ethereum address of the Coinbase wallet
        }
    """
    pass
async def coinbase_transaction_sender(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for restoring a Coinbase wallet and sending a transaction

    Args:
        input: Dict[str, Any]:
            assetId: str (required) - The ID of the asset/token to send
            recipient_address: str (required) - The destination address for the transaction
            amount: str (required) - The amount of tokens to send

    Returns:
        Dict[str, Any]: {
            status: str - The status of the transaction (e.g., 'success', 'pending', 'failed')
            transactionHash: str - The hash of the completed transaction
            transactionLink: str - A link to view the transaction on a block explorer
        }
    """
    pass
async def coinbase_transactions_getter(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for getting the transactions of a Coinbase wallet after restoring it

    Args:
        input: Dict[str, Any]:

    Returns:
        Dict[str, Any]: {
            columnsCount: float
            rowsCount: float
            tableCsv: str
        }
    """
    pass
async def send_email(input: Dict[str, Any]) -> Dict[str, Any]:
    """Sends an email using SMTP.

    Args:
        input: Dict[str, Any]:
            recipient_email: str (required) - The recipient's email address
            subject: str (required) - The email subject
            body: str (required) - The email body

    Returns:
        Dict[str, Any]: {
            message: str - A message indicating the result of the operation
            status: str - The status of the email sending operation ('success' or 'failed')
        }
    """
    pass
async def download_pages(input: Dict[str, Any]) -> Dict[str, Any]:
    """Downloads a URL and converts its HTML content to Markdown

    Args:
        input: Dict[str, Any]:
            url: str (required) - A URL of a web page to download

    Returns:
        Dict[str, Any]: {
            markdown: str - The Markdown content converted from the web page
        }
    """
    pass
async def coinbase_faucet_caller(input: Dict[str, Any]) -> Dict[str, Any]:
    """Tool for calling a faucet on Coinbase

    Args:
        input: Dict[str, Any]:

    Returns:
        Dict[str, Any]: {
            data: str
        }
    """
    pass
async def google_search(input: Dict[str, Any]) -> Dict[str, Any]:
    """This function takes a question as input and returns a comprehensive answer, along with the sources and statements used to generate the answer.

    Args:
        input: Dict[str, Any]:
            query: str (required) - The search query to look up

    Returns:
        Dict[str, Any]: {
            query: str
            results: List[Dict[str, Any]]
        }
    """
    pass
async def perplexity_api(input: Dict[str, Any]) -> Dict[str, Any]:
    """Searches the web using Perplexity API (limited)

    Args:
        input: Dict[str, Any]:
            query: str (required) - The search query to send to Perplexity API

    Returns:
        Dict[str, Any]: {
            response: str - The search results and analysis from Perplexity API
        }
    """
    pass

#
# <tool_key_path_to_function_name>
# local:::__official_shinkai:::shinkai_typescript_unsafe_processor shinkai_typescript_unsafe_processor
# local:::__official_shinkai:::shinkai_llm_map_reduce_processor shinkai_llm_map_reduce_processor
# local:::__official_shinkai:::shinkai_llm_prompt_processor shinkai_llm_prompt_processor
# local:::__official_shinkai:::shinkai_sqlite_query_executor shinkai_sqlite_query_executor
# local:::__official_shinkai:::shinkai_process_embeddings shinkai_process_embeddings
# local:::__official_shinkai:::shinkai_tool_config_updater shinkai_tool_config_updater
# local:::__official_shinkai:::coinbase_balance_getter coinbase_balance_getter
# local:::__official_shinkai:::x_twitter_post x_twitter_post
# local:::__official_shinkai:::math_expression_evaluator math_expression_evaluator
# local:::__official_shinkai:::duckduckgo_search duck_duck_go_search
# local:::__official_shinkai:::memory_management memory_management
# local:::__official_shinkai:::write_file_contents write_file_contents
# local:::__official_shinkai:::email_answerer email_answerer
# local:::__official_shinkai:::meme_generator meme_generator
# local:::__official_shinkai:::coinbase_wallet_creator coinbase_wallet_creator
# local:::__official_shinkai:::perplexity perplexity
# local:::__official_shinkai:::update_file_with_prompt update_file_with_prompt
# local:::__official_shinkai:::youtube_transcript_summarizer youtube_transcript_summarizer
# local:::__official_shinkai:::smart_search_engine smart_search_engine
# local:::__official_shinkai:::email_fetcher email_fetcher
# local:::__official_shinkai:::x_twitter_search x_twitter_search
# local:::__official_shinkai:::read_file_contents read_file_contents
# local:::__official_shinkai:::coinbase_my_address_getter coinbase_my_address_getter
# local:::__official_shinkai:::coinbase_transaction_sender coinbase_transaction_sender
# local:::__official_shinkai:::coinbase_transactions_getter coinbase_transactions_getter
# local:::__official_shinkai:::send_email send_email
# local:::__official_shinkai:::download_pages download_pages
# local:::__official_shinkai:::coinbase_faucet_caller coinbase_faucet_caller
# local:::__official_shinkai:::google_search google_search
# local:::__official_shinkai:::perplexity_api perplexity_api
# </tool_key_path_to_function_name>
#
