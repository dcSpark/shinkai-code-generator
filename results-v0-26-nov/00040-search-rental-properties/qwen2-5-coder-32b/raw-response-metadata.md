```json
{
  "id": "shinkai-tool-rental-property-scraper",
  "name": "Shinkai: Rental Property Scraper",
  "description": "Tool for scraping rental properties from an API and storing them in a SQLite database",
  "author": "Shinkai",
  "keywords": [
    "rental properties",
    "web scraping",
    "SQLite",
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
      "city": { "type": "string" },
      "max_price": { "type": "number", "nullable": true },
      "min_bedrooms": { "type": "number", "nullable": true }
    },
    "required": [
      "city"
    ]
  },
  "result": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "sqlTables": [
    {
      "name": "rental_properties",
      "definition": "CREATE TABLE rental_properties (id INTEGER PRIMARY KEY, title TEXT NOT NULL, address TEXT NOT NULL, price REAL NOT NULL, bedrooms INTEGER NOT NULL)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get properties by city",
      "query": "SELECT * FROM rental_properties WHERE address LIKE :city"
    },
    {
      "name": "Get properties within price range",
      "query": "SELECT * FROM rental_properties WHERE price BETWEEN :min_price AND :max_price"
    },
    {
      "name": "Count properties by bedrooms",
      "query": "SELECT COUNT(*) as count, bedrooms FROM rental_properties GROUP BY bedrooms"
    }
  ]
}
```