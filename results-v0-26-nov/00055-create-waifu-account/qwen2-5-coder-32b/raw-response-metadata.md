```json
{
  "id": "shinkai-tool-waifu-character-creator",
  "name": "Shinkai: Waifu Character Creator",
  "description": "Tool for creating a waifu character and setting up an Instagram account",
  "author": "Shinkai",
  "keywords": [
    "waifu",
    "character",
    "instagram",
    "account setup"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "waifu_characteristics": { "type": "array", "items": { "type": "string" } },
      "account_name": { "type": "string" }
    },
    "required": [
      "waifu_characteristics",
      "account_name"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "success": { "type": "boolean" },
      "message": { "type": "string", "nullable": true }
    },
    "required": [
      "success",
      "message"
    ]
  },
  "sqlTables": [
    {
      "name": "waifu_characters",
      "definition": "CREATE TABLE waifu_characters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, age INTEGER NOT NULL, characteristics TEXT NOT NULL, bio TEXT NOT NULL)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all waifu characters",
      "query": "SELECT * FROM waifu_characters"
    },
    {
      "name": "Get waifu character by name",
      "query": "SELECT * FROM waifu_characters WHERE name = :name"
    }
  ]
}
```