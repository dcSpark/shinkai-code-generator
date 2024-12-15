# Shinkai Prompt Testing

Requirements
* Shinkai API running on http://localhost:9950 (or overwritten by env SHINKAI_API_URL)
* Ollama running on http://localhost:11434 (or overwritten by env OLLAMA_API_URL)
* Together.ai API key set in TOGETHER_API_KEY environment variable (required for Together.ai models)
* Deno 2.x

## Run Prompts & Execute Results
* `deno task start test=benchmark-\*`

### Run specific tests:
* `deno task start test=download-url-and-sql` - Runs only the `download-url-and-sql` test
* `deno task start test=download-url-and-sql test=download-url-and-summary` - Runs the `download-url-and-sql` and `download-url-and-summary` tests
* Wildcards can be used: `deno task start test=benchmark-\*`

## Notes on Prompt Results:
* Results will be stored in `results/{language}/{model-name}/{test-code}/`
* `prompt-` stores prompts
* `raw-` store raw responses
* `src-` store parsed response (valid Typescript or JSON)
* `shinkai_local_tools.py` stores the dynamic tools file used in the test
* `shinkai-local-tools.ts` stores the dynamic tools file used in the test
* `execute-output` stores the output of the executed code

## Using `models.txt`
The `models.txt` file allows you to specify which models to use for testing. Each line in the file should specify a model in the format:

```
ollama:qwen2.5-coder:32b
together:meta-llama/Llama-3.3-70B-Instruct-Turbo
```

- **Engine Prefix**: The prefix (`ollama` or `together` in the examples) indicates which engine the model belongs to.
- **Model Name**: The rest of the line specifies the model name. For Together.ai models, use the full model path (e.g., `meta-llama/Llama-3.3-70B-Instruct-Turbo`).

If `models.txt` is not present, the system will default to using models obtained from the `getInstalledModels()` function.
