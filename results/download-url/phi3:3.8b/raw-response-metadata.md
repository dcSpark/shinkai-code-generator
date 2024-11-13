 ```json
{
  "name": "metadata",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "description": { "type": "string" },
    "author": { "type": "string" },
    "keywords": {
      "type": "array",
      "items": { "type": "string" }
    },
    "configurations": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "parameters": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "result": {
      "type": "object",
      "properties": {
        "content": { "type": "string" }
      },
      "required": []
    }
  },
  "required": ["id", "description", "author", "configurations", "parameters", "result"]
}
```