```json
{
  "id": "shinkai-tool-research-creator",
  "name": "Shinkai: Research Creator",
  "description": "Tool for creating and storing research results based on topic and depth",
  "author": "Shinkai",
  "keywords": [
    "research",
    "topic",
    "depth",
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
      "topic": { "type": "string" },
      "depth": { "type": "string", "enum": ["basic", "intermediate", "advanced"] }
    },
    "required": [
      "topic",
      "depth"
    ]
  },
  "result": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "sqlTables": [
    {
      "name": "ResearchResults",
      "definition": "CREATE TABLE ResearchResults (id INTEGER PRIMARY KEY AUTOINCREMENT, topic TEXT NOT NULL, depth TEXT NOT NULL, result TEXT NOT NULL)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all research results",
      "query": "SELECT * FROM ResearchResults"
    },
    {
      "name": "Get research results by topic",
      "query": "SELECT * FROM ResearchResults WHERE topic = :topic"
    },
    {
      "name": "Get research results by depth",
      "query": "SELECT * FROM ResearchResults WHERE depth = :depth"
    }
  ]
}
```