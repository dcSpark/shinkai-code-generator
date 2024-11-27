```json
{
  "id": "shinkai-tool-web-scraper",
  "name": "Shinkai: Web Scraper",
  "description": "Tool for scraping data from a web page using Docker and Puppeteer",
  "author": "Shinkai",
  "keywords": [
    "web scraper",
    "docker",
    "puppeteer"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "target_url": { "type": "string" },
      "data_selectors": { "type": "array", "items": { "type": "string" } },
      "output_format": { "type": "string" }
    },
    "required": [
      "target_url",
      "data_selectors",
      "output_format"
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
  "sqlTables": [],
  "sqlQueries": []
}
```