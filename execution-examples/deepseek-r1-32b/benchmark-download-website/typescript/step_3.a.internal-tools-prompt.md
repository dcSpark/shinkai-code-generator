<rules>
* You need to generate of list of tool-router-keys.
* They must be concise and exact.
* In the following input-command section, there is a complete document that describes a software tool.
* There are some literal internal-libaries to be used in the "# Internal Libraries" section. 
* Extract the internal-libraries names used as queries as in a JSON ARRAY format.
* You must convert the library to the corresponding tool-router-key, they are in the tool-router-key tag section. 
* In the query must only contain the name of the exact internal-library corresponding tool-router-key.
</rules>

<tool_router_key>
local:::__official_shinkai:::shinkai_typescript_unsafe_processor
local:::__official_shinkai:::shinkai_llm_map_reduce_processor
local:::__official_shinkai:::shinkai_llm_prompt_processor
local:::__official_shinkai:::shinkai_sqlite_query_executor
local:::__official_shinkai:::shinkai_process_embeddings
local:::__official_shinkai:::shinkai_tool_config_updater
local:::__official_shinkai:::coinbase_balance_getter
local:::__official_shinkai:::x_twitter_post
local:::__official_shinkai:::math_expression_evaluator
local:::__official_shinkai:::duckduckgo_search
local:::__official_shinkai:::memory_management
local:::__official_shinkai:::write_file_contents
local:::__official_shinkai:::email_answerer
local:::__official_shinkai:::meme_generator
local:::__official_shinkai:::coinbase_wallet_creator
local:::__official_shinkai:::perplexity
local:::__official_shinkai:::update_file_with_prompt
local:::__official_shinkai:::youtube_transcript_summarizer
local:::__official_shinkai:::smart_search_engine
local:::__official_shinkai:::email_fetcher
local:::__official_shinkai:::x_twitter_search
local:::__official_shinkai:::read_file_contents
local:::__official_shinkai:::coinbase_my_address_getter
local:::__official_shinkai:::coinbase_transaction_sender
local:::__official_shinkai:::coinbase_transactions_getter
local:::__official_shinkai:::send_email
local:::__official_shinkai:::download_pages
local:::__official_shinkai:::coinbase_faucet_caller
local:::__official_shinkai:::google_search
local:::__official_shinkai:::perplexity_api
local:::__localhost_sep_shinkai:::my_cool_shinkai_and_cursor_tool
local:::__localhost_sep_shinkai:::the_best_download_pages
local:::__official_shinkai:::shinkai_typescript_unsafe_processor
local:::__official_shinkai:::shinkai_llm_map_reduce_processor
local:::__official_shinkai:::shinkai_llm_prompt_processor
local:::__official_shinkai:::shinkai_sqlite_query_executor
local:::__official_shinkai:::shinkai_process_embeddings
local:::__official_shinkai:::shinkai_tool_config_updater
</tool_router_key>

<input_command>
# Requirements
A tool that takes a URL as input and returns the complete HTML content of the website as a string.

# System Libraries
axios  : For making HTTP requests to download web pages

# Internal Libraries
downloadPages  : Converts HTML content to Markdown (not needed for this task)
readFileContents  : Reads file contents from a path (not needed for this task)

# External Libraries
axios  : HTTP client library for making GET requests to websites

# Example Inputs and Outputs  
Input: { "url": "https://example.com" }
Output: { "content": "<html>...</html>" }

</input_command>

<formatting>
* The output should be a single `string[]`
* The output should be formatted as follows:
<output>
```json
    ["local:::author1:::name2", "local:::author7:::name5", ...]
```
</output>

* If there are no internal-libraries, return
<empty-external-libraries-output>
```json
    []
```
</empty-external-libraries-output>

* Do not change the libraries, do not add or remove libraries.
* Do not include System Libraies or External Libraries
* Return the final json array that contains the tool-router-keys
</formatting>

