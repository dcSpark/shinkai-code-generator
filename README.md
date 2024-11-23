# Shinkai Prompt Testing

Requirements 
* Shinkai API running on http://localhost:9950 (or overwritten by env SHINKAI_API_URL)
* Ollama running on http://localhost:11434 (or overwritten by env OLLAMA_API_URL)
* Deno 2.x

## Run Prompts & Execute Results
* `deno task start`

## Notes on Prompt Results:
* Results will be stored in `results/{model-name}/{test-code}/` 
* `prompt-` stores prompts 
* `raw-` store raw responses
* `src-` store parsed response (valid Typescript or JSON)
* `@shinkai/local-tools.ts` stores the local-tools.ts file used in the test
* `execute-output` stores the output of the executed code
