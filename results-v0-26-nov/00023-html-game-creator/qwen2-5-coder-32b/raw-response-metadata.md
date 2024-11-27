```json
{
  "id": "shinkai-tool-game-generator",
  "name": "Shinkai: Game HTML Generator",
  "description": "Generates HTML content for different types of games based on the specified difficulty level.",
  "author": "Shinkai",
  "keywords": [
    "game generator",
    "HTML generation",
    "number guess game"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "game_type": { "type": "string" },
      "difficulty": { "type": "string", "enum": ["easy", "medium", "hard"] }
    },
    "required": [
      "game_type",
      "difficulty"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "htmlContent": { "type": "string" }
    },
    "required": [
      "htmlContent"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```