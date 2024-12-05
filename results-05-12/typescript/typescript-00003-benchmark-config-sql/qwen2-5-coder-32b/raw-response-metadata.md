```json
{
  "id": "openai-chat-completion",
  "name": "OpenAI Chat Completion",
  "description": "Tool for generating chat completions using OpenAI's API and storing the results in a SQLite database",
  "author": "Shinkai",
  "keywords": [
    "OpenAI",
    "chat completion",
    "API",
    "SQLite"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "api_key": { "type": "string" }
    },
    "required": ["api_key"]
  },
  "parameters": {
    "type": "object",
    "properties": {
      "prompt": { "type": "string" }
    },
    "required": ["prompt"]
  },
  "result": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "sqlTables": [
    {
      "name": "openai_responses",
      "definition": "CREATE TABLE IF NOT EXISTS openai_responses (id INTEGER PRIMARY KEY AUTOINCREMENT, prompt TEXT NOT NULL, response TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all responses",
      "query": "SELECT * FROM openai_responses"
    },
    {
      "name": "Get response by prompt",
      "query": "SELECT * FROM openai_responses WHERE prompt = :prompt"
    },
    {
      "name": "Get latest response",
      "query": "SELECT * FROM openai_responses ORDER BY timestamp DESC LIMIT 1"
    }
  ],
  "tools": [
    "local:::rust_toolkit:::shinkai_sqlite_query_executor"
  ]
}
```