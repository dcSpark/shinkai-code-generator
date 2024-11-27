```json
{
  "id": "shinkai-tool-apartment-search",
  "name": "Shinkai: Apartment Search Tool",
  "description": "Tool for searching apartments based on location, price range, and requirements",
  "author": "Shinkai",
  "keywords": [
    "apartment search",
    "real estate",
    "location filter",
    "price range",
    "requirements"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "price_range": {
        "type": "array",
        "items": { "type": "number" },
        "minItems": 2,
        "maxItems": 2
      },
      "requirements": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": [
      "location",
      "price_range",
      "requirements"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "apartments": {
        "type": "array",
        "items": { "type": "any" }
      }
    },
    "required": [
      "apartments"
    ]
  },
  "sqlTables": [
    {
      "name": "apartments",
      "definition": "CREATE TABLE apartments (id SERIAL PRIMARY KEY, location VARCHAR(255) NOT NULL, price NUMERIC NOT NULL, requirements TEXT[])"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get apartments by location and price range",
      "query": "SELECT * FROM apartments WHERE location = :location AND price BETWEEN :minPrice AND :maxPrice"
    },
    {
      "name": "Get apartments with specific requirements",
      "query": "SELECT * FROM apartments WHERE location = :location AND price BETWEEN :minPrice AND :maxPrice AND requirements LIKE :requirement1"
    },
    {
      "name": "Get all apartments",
      "query": "SELECT * FROM apartments"
    }
  ]
}
```