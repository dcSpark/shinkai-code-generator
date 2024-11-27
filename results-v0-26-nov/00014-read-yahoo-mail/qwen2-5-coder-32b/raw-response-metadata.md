```json
{
  "id": "shinkai-tool-email-fetcher",
  "name": "Shinkai: Email Fetcher",
  "description": "Tool for fetching emails from a Yahoo account using IMAP",
  "author": "Shinkai",
  "keywords": [
    "email",
    "fetcher",
    "imap",
    "yahoo"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "default": "" },
      "max_results": { "type": "number", "default": 10 },
      "include_attachments": { "type": "boolean", "default": false },
      "folder": { "type": "string", "default": "INBOX" }
    },
    "required": []
  },
  "result": {
    "type": "object",
    "properties": {
      "emails": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "subject": { "type": "string" },
            "from": { "type": "string" },
            "to": { "type": "string" },
            "date": { "type": "string" },
            "text": { "type": "string" },
            "html": { "type": "string" },
            "attachments": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "filename": { "type": "string" },
                  "content": { "type": "string" }
                }
              },
              "nullable": true
            }
          }
        }
      }
    },
    "required": [
      "emails"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```