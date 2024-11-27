```json
{
  "id": "email-discount-request",
  "name": "Email Discount Request",
  "description": "Sends an email request for a discount on property rent to the landlord",
  "author": "Shinkai",
  "keywords": [
    "email",
    "discount",
    "property",
    "rent"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "landlord_email": { "type": "string" },
      "property_address": { "type": "string" },
      "desired_discount": { "type": "number" }
    },
    "required": [
      "landlord_email",
      "property_address",
      "desired_discount"
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