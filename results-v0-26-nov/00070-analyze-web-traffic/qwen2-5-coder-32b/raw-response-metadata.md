```json
{
  "id": "shinkai-tool-website-analytics",
  "name": "Shinkai: Website Analytics Fetcher",
  "description": "Tool for fetching web traffic and keyword data for a given website URL within a specified date range",
  "author": "Shinkai",
  "keywords": [
    "web traffic",
    "keyword data",
    "website analytics",
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
      "website_url": { "type": "string" },
      "date_range": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": [
      "website_url",
      "date_range"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "traffic_data": { "type": "object" },
      "keywords_data": { "type": "object" }
    },
    "required": [
      "traffic_data",
      "keywords_data"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```