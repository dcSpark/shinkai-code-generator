```json
{
  "id": "parse-pdf-from-url",
  "name": "Parse PDF from URL",
  "description": "Downloads a PDF file from a given URL and parses its content into plain text, saving it to a local file.",
  "author": "",
  "keywords": [
    "PDF parsing",
    "URL download",
    "text extraction"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "url": { "type": "string" }
    },
    "required": ["url"]
  },
  "result": {
    "type": "object",
    "properties": {
      "filePath": { "type": "string" }
    },
    "required": ["filePath"]
  },
  "sqlTables": [],
  "sqlQueries": [],
  "tools": []
}
```