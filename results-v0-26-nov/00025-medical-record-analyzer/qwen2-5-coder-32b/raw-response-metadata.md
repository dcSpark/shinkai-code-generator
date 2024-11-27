```json
{
  "id": "shinkai-tool-symptom-diagnosis",
  "name": "Shinkai: Symptom Diagnosis Tool",
  "description": "Tool for diagnosing symptoms and suggesting possible diagnoses based on input records.",
  "author": "Shinkai",
  "keywords": [
    "symptom diagnosis",
    "health tool",
    "diagnosis suggestions",
    "local SQLite database"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "databasePath": { "type": "string" }
    },
    "required": ["databasePath"]
  },
  "parameters": {
    "type": "object",
    "properties": {
      "records": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": { "type": "string" },
            "symptoms": { "type": "array", "items": { "type": "string" } },
            "diagnosis": { "type": "string", "nullable": true }
          },
          "required": ["date", "symptoms"]
        }
      }
    },
    "required": ["records"]
  },
  "result": {
    "type": "object",
    "properties": {
      "suggestedDiagnoses": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": { "type": "string" },
            "symptoms": { "type": "array", "items": { "type": "string" } },
            "possibleDiagnoses": { "type": "array", "items": { "type": "string" } },
            "solutions": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["date", "symptoms", "possibleDiagnoses", "solutions"]
        }
      }
    },
    "required": ["suggestedDiagnoses"]
  },
  "sqlTables": [
    {
      "name": "suggested_diagnoses",
      "definition": "CREATE TABLE suggested_diagnoses (date TEXT, symptoms TEXT, possibleDiagnoses TEXT, solutions TEXT)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all suggested diagnoses",
      "query": "SELECT * FROM suggested_diagnoses"
    },
    {
      "name": "Get suggested diagnoses by date",
      "query": "SELECT * FROM suggested_diagnoses WHERE date = :date"
    },
    {
      "name": "Delete suggested diagnoses by date",
      "query": "DELETE FROM suggested_diagnoses WHERE date = :date"
    }
  ]
}
```