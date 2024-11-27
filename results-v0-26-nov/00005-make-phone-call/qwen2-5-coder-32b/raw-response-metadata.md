```json
{
  "id": "shinkai-tool-twilio-call",
  "name": "Shinkai: Twilio Call Creator",
  "description": "Tool for creating a call using Twilio",
  "author": "Shinkai",
  "keywords": [
    "twilio",
    "call creator",
    "shinkai"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "accountSid": { "type": "string" },
      "authToken": { "type": "string" }
    },
    "required": [
      "accountSid",
      "authToken"
    ]
  },
  "parameters": {
    "type": "object",
    "properties": {
      "phone_number": { "type": "string" },
      "message": { "type": "string" }
    },
    "required": [
      "phone_number",
      "message"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "call_sid": { "type": "string", "nullable": true },
      "error": { "type": "string", "nullable": true }
    },
    "required": []
  },
  "sqlTables": [],
  "sqlQueries": []
}
```