```json
{
  "id": "tool-download-image",
  "name": "Download Image",
  "description": "Downloads an image from a given URL and saves it locally.",
  "author": "",
  "keywords": [
    "image downloader",
    "URL to image",
    "download image"
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
    "required": [
      "url"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "filePath": { "type": "string" }
    },
    "required": [
      "filePath"
    ]
  },
  "sqlTables": [],
  "sqlQueries": [],
  "tools": []
}
```