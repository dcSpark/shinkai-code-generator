# Shinkai Prompt Testing

Requirements 
* Shinkai API running on http://localhost:9950 (or overwritten by env SHINKAI_API_URL)
* Ollama running on http://localhost:11434 (or overwritten by env OLLAMA_API_URL)
* Deno 2.x

## Run Prompts & Execute Results
* `deno task start`

## Stages:
* `shinkai` - Fetches the prompts and tools from Shinkai and stores them in `results/{test}/{model}/` 
* `llm` - Runs the promts against LLMs and stores the results in `results/{test}/{model}/`
* `exec` - Executes the generated code and stores the results in `results/{test}/{model}/`


### Stage selection examples:
* `deno task start` - Runs all stages
* `deno task start shinkai` - Runs only shinkai stage
* `deno task start llm` - Runs only llm stage
* `deno task start exec` - Runs only exec stage
* Options can be combined, for example `deno task start shinkai llm` to run shinkai and llm stages.

## Notes on Prompt Results:
* Results will be stored in `results/{model-name}/{test-code}/` 
* `prompt-` stores prompts 
* `raw-` store raw responses
* `src-` store parsed response (valid Typescript or JSON)
* `@shinkai/local-tools.ts` stores the local-tools.ts file used in the test
* `execute-output` stores the output of the executed code
