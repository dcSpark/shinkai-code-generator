```json
{
  "id": "shinkai-openai-chat-completions",
  "name": "Shinkai OpenAI Chat Completions",
  "description": "Tool for generating chat completions using the OpenAI API",
  "author": "Shinkai",
  "keywords": [
    "openai",
    "chat",
    "completions",
    "shinkai"
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
    "properties": {
      "response": { "type": "string" }
    },
    "required": ["response"]
  },
  "sqlTables": [],
  "sqlQueries": [],
  "tools": []
}
```