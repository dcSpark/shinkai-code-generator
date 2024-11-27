```json
{
  "id": "shinkai-tool-file-sharing-api",
  "name": "Shinkai: File Sharing API",
  "description": "API for uploading, downloading, and searching files with storage restrictions.",
  "author": "Shinkai",
  "keywords": [
    "file sharing",
    "upload",
    "download",
    "search",
    "storage restrictions"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "storage_path": { "type": "string" },
      "allowed_file_types": { "type": "array", "items": { "type": "string" } },
      "max_file_size_mb": { "type": "number" }
    },
    "required": [
      "storage_path",
      "allowed_file_types",
      "max_file_size_mb"
    ]
  },
  "result": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "sqlTables": [
    {
      "name": "files",
      "definition": "CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, path TEXT NOT NULL, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get file by filename",
      "query": "SELECT * FROM files WHERE name = :filename"
    },
    {
      "name": "Search files by name",
      "query": "SELECT * FROM files WHERE name LIKE :searchQuery"
    },
    {
      "name": "List all files",
      "query": "SELECT * FROM files"
    }
  ]
}
```