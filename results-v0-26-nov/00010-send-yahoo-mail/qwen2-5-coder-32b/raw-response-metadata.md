```json
{
  "id": "shinkai-tool-send-email",
  "name": "Shinkai: Send Email via OAuth2",
  "description": "Sends an email using OAuth2 authentication with Google and Nodemailer through Yahoo service.",
  "author": "Shinkai",
  "keywords": [
    "OAuth2",
    "Google",
    "Nodemailer",
    "Yahoo",
    "email",
    "send"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "clientId": { "type": "string" },
      "clientSecret": { "type": "string" },
      "refreshToken": { "type": "string" }
    },
    "required": [
      "clientId",
      "clientSecret",
      "refreshToken"
    ]
  },
  "parameters": {
    "type": "object",
    "properties": {
      "to": { "type": "string" },
      "subject": { "type": "string" },
      "body": { "type": "string" },
      "attachments": { "type": "array", "items": { "type": "string" }, "nullable": true }
    },
    "required": [
      "to",
      "subject",
      "body"
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
      "definition": "CREATE TABLE emails (id SERIAL PRIMARY KEY, to_email TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, attachments TEXT[], sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all emails",
      "query": "SELECT * FROM emails"
    },
    {
      "name": "Get email by recipient",
      "query": "SELECT * FROM emails WHERE to_email = :toEmail"
    },
    {
      "name": "Get latest email sent",
      "query": "SELECT * FROM emails ORDER BY sent_at DESC LIMIT 1"
    }
  ]
}
```