```json
{
  "id": "shinkai-tool-store-business-model",
  "name": "Shinkai: Store Business Model",
  "description": "Stores the business model of a company in a specific industry",
  "author": "Shinkai",
  "keywords": [
    "business model",
    "company",
    "industry",
    "store data"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "company_name": { "type": "string" },
      "industry": { "type": "string" }
    },
    "required": [
      "company_name",
      "industry"
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
  "sqlTables": [
    {
      "name": "business_models",
      "definition": "CREATE TABLE IF NOT EXISTS business_models (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, industry TEXT NOT NULL, model_description TEXT NOT NULL)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all business models",
      "query": "SELECT * FROM business_models"
    },
    {
      "name": "Get business model by company name",
      "query": "SELECT * FROM business_models WHERE company_name = :company_name"
    },
    {
      "name": "Get business model by industry",
      "query": "SELECT * FROM business_models WHERE industry = :industry"
    }
  ]
}
```