# Shinkai Prompt Testing

Requirements 
* Ollama running on "http://localhost:11434 (or overwritten by env OLLAMA_API_URL)


Run
* `deno task start`

Test
* Results will be stored in `results/{model}/{test}/` 

* `prompt-` stores prompts 
* `raw-` store raw responses
* `src-` store parsed response (valid Typescript or JSON)