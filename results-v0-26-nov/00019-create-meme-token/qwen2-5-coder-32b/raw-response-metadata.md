```json
{
  "id": "shinkai-tool-deploy-token",
  "name": "Shinkai: Deploy Token",
  "description": "Deploys a new token on the specified blockchain using a smart contract.",
  "author": "Shinkai",
  "keywords": [
    "token deployment",
    "smart contract",
    "blockchain"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "token_name": { "type": "string" },
      "initial_supply": { "type": "number" },
      "blockchain": { "type": "string" }
    },
    "required": [
      "token_name",
      "initial_supply",
      "blockchain"
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