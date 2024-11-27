```json
{
  "id": "shinkai-tool-fetch-nfts",
  "name": "Shinkai: Fetch NFTs",
  "description": "Fetches NFTs for a given wallet address and blockchain",
  "author": "Shinkai",
  "keywords": [
    "NFTs",
    "wallet",
    "blockchain",
    "ethereum",
    "solana"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "wallet_address": { "type": "string" },
      "blockchain": { "type": "string", "enum": ["ethereum", "solana"] }
    },
    "required": [
      "wallet_address",
      "blockchain"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "nfts": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "token_id": { "type": "string" },
            "metadata": {}
          },
          "required": [
            "token_id",
            "metadata"
          ]
        }
      }
    },
    "required": [
      "nfts"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```