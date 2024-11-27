```json
{
  "id": "shinkai-tool-bible-verse-selector",
  "name": "Shinkai: Bible Verse Selector",
  "description": "Selects a random Bible verse based on the provided topic and stores it in an SQLite database.",
  "author": "Shinkai",
  "keywords": [
    "bible",
    "verse",
    "random selection",
    "sqlite"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "translation": { "type": "string", "default": "KJV" },
      "topic": { "type": "string" }
    },
    "required": []
  },
  "result": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "sqlTables": [
    {
      "name": "BibleVerses",
      "definition": "CREATE TABLE BibleVerses (id INTEGER PRIMARY KEY AUTOINCREMENT, verse TEXT NOT NULL, interpretation TEXT NOT NULL, translation TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all verses",
      "query": "SELECT * FROM BibleVerses"
    },
    {
      "name": "Get verse by topic",
      "query": "SELECT * FROM BibleVerses WHERE verse LIKE :topic OR interpretation LIKE :topic"
    },
    {
      "name": "Get latest verse added",
      "query": "SELECT * FROM BibleVerses ORDER BY created_at DESC LIMIT 1"
    }
  ]
}
```