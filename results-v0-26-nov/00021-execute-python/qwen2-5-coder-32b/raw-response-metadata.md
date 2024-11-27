```json
{
  "id": "shinkai-tool-run-python-code",
  "name": "Shinkai: Run Python Code",
  "description": "Tool to execute Python code provided as input with optional timeout.",
  "author": "Shinkai",
  "keywords": [
    "Python",
    "code execution",
    "timeout handling"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "code": { "type": "string" },
      "timeout_seconds": { "type": "number", "minimum": 1, "default": 30 }
    },
    "required": [
      "code"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "result": { "type": ["string", "null"] },
      "error": { "type": ["string", "null"] }
    },
    "required": []
  },
  "sqlTables": [],
  "sqlQueries": []
}
```