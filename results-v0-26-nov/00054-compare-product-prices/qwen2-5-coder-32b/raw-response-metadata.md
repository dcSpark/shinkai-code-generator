```json
{
  "id": "shinkai-tool-price-fetcher",
  "name": "Shinkai: Price Fetcher",
  "description": "Tool for fetching product prices from multiple stores",
  "author": "Shinkai",
  "keywords": [
    "price fetcher",
    "product search",
    "store comparison",
    "shinkai"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "storeUrls": {
        "type": "object",
        "additionalProperties": {
          "type": "string"
        }
      }
    },
    "required": [
      "storeUrls"
    ]
  },
  "parameters": {
    "type": "object",
    "properties": {
      "product_name": { "type": "string" },
      "max_price": { "type": "number", "nullable": true }
    },
    "required": [
      "product_name"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "results": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "store": { "type": "string" },
            "price": { "type": "number" },
            "url": { "type": "string" }
          },
          "required": [
            "store",
            "price",
            "url"
          ]
        }
      }
    },
    "required": [
      "results"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```