```json
{
  "id": "shinkai-tool-voice-birthday-call",
  "name": "Shinkai: Voice Birthday Call",
  "description": "Sends a personalized birthday greeting via voice call using specified voice model",
  "author": "Shinkai",
  "keywords": [
    "voice call",
    "birthday",
    "personalized greeting",
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
      "phone_number": { "type": "string" },
      "name": { "type": "string" },
      "voice_model_path": { "type": "string" }
    },
    "required": [
      "phone_number",
      "name",
      "voice_model_path"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "success": { "type": "boolean" },
      "message": { "type": "string" }
    },
    "required": [
      "success",
      "message"
    ]
  },
  "sqlTables": [
    {
      "name": "calls",
      "definition": "CREATE TABLE calls (id INTEGER PRIMARY KEY AUTOINCREMENT, phone_number TEXT NOT NULL, name TEXT NOT NULL, message TEXT NOT NULL, success BOOLEAN NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get call by phone number",
      "query": "SELECT * FROM calls WHERE phone_number = :phone_number"
    },
    {
      "name": "Get latest successful call",
      "query": "SELECT * FROM calls WHERE success = true ORDER BY created_at DESC LIMIT 1"
    }
  ]
}
```