```json
{
  "id": "shinkai-tool-image-review",
  "name": "Shinkai: Image Review Suggestions",
  "description": "Tool for obtaining appearance improvement suggestions for images from an AI service",
  "author": "Shinkai",
  "keywords": [
    "image review",
    "appearance improvement",
    "AI suggestions",
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
      "image_paths": { "type": "array", "items": { "type": "string" } },
      "focus_areas": { "type": "array", "items": { "type": "string" }, "nullable": true }
    },
    "required": [
      "image_paths"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "suggestions": { "type": "object", "additionalProperties": { "type": "array", "items": { "type": "string" } } }
    },
    "required": [
      "suggestions"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```