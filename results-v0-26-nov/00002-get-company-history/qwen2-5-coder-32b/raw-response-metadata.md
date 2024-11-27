```json
{
  "id": "shinkai-tool-company-history",
  "name": "Shinkai: Company History Fetcher",
  "description": "Tool for fetching the history of a company from OpenAI API",
  "author": "Shinkai",
  "keywords": [
    "company history",
    "openai api",
    "shinkai"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "company_name": { "type": "string" },
      "year_from": { "type": "number", "nullable": true }
    },
    "required": [
      "company_name"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "summary": { "type": "string" }
    },
    "required": [
      "summary"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```