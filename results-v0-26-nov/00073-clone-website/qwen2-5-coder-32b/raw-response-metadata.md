```json
{
  "id": "shinkai-tool-parse-html-structure",
  "name": "Shinkai: Parse HTML Structure",
  "description": "Parses the HTML structure of a given website URL and optionally includes asset links (CSS, JS)",
  "author": "Shinkai",
  "keywords": [
    "HTML parser",
    "website structure",
    "asset extraction"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "website_url": { "type": "string" },
      "include_assets": { "type": "boolean", "default": false }
    },
    "required": [
      "website_url"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "structure": { "type": "object" }
    },
    "required": [
      "structure"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```