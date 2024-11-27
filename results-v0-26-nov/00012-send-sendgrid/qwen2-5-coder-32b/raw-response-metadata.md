```json
{
  "id": "shinkai-tool-send-email",
  "name": "Shinkai: Send Email",
  "description": "Sends an email with optional attachments using SendGrid API and logs the status to SQLite.",
  "author": "Shinkai",
  "keywords": [
    "sendgrid",
    "email",
    "attachment",
    "sqlite"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "sendGridApiKey": { "type": "string" },
      "sqliteDbPath": { "type": "string" }
    },
    "required": [
      "sendGridApiKey",
      "sqliteDbPath"
    ]
  },
  "parameters": {
    "type": "object",
    "properties": {
      "to": { "type": "string" },
      "subject": { "type": "string" },
      "body": { "type": "string" },
      "from": { "type": "string" },
      "attachments": { "type": "array", "items": { "type": "string" }, "nullable": true }
    },
    "required": [
      "to",
      "subject",
      "body",
      "from"
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
      "name": "emails",
      "definition": "CREATE TABLE emails (id INTEGER PRIMARY KEY AUTOINCREMENT, to_address VARCHAR(255) NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, from_address VARCHAR(255) NOT NULL, status VARCHAR(50) NOT NULL, sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all emails",
      "query": "SELECT * FROM emails"
    },
    {
      "name": "Get email by ID",
      "query": "SELECT * FROM emails WHERE id = :id"
    },
    {
      "name": "Get emails by status",
      "query": "SELECT * FROM emails WHERE status = :status"
    }
  ]
}
```