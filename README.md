# Shinkai Prompt Testing

## Requirements 
* Shinkai Node running
* Ollama running
* Firecrawl running
* Deno 2.x

## Install
```
git clone git@github.com:dcSpark/shinkai-prompt-test.git 
cd shinkai-prompt-test
ollama pull llama3.1:8b-instruct-q4_1  # for quick iterations
ollama pull deepseek-r1:32b            # for full testing 
cp .env.example .env
```
> setup BRAVE_API_KEY and other keys in .env

## Run Prompts & Execute Results
```
deno -A src/index.ts
```