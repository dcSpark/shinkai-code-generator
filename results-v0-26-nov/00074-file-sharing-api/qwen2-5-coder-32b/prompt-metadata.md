
# RULE I:
This is the SCHEMA for the METADATA:
```json
 {
  "name": "metaschema",
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "The name of the schema"
      },
      "type": {
        "type": "string",
        "enum": [
          "object",
          "array",
          "string",
          "number",
          "boolean",
          "null"
        ]
      },
      "properties": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#/$defs/schema_definition"
        }
      },
      "items": {
        "anyOf": [
          {
            "$ref": "#/$defs/schema_definition"
          },
          {
            "type": "array",
            "items": {
              "$ref": "#/$defs/schema_definition"
            }
          }
        ]
      },
      "required": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "additionalProperties": {
        "type": "boolean"
      }
    },
    "required": [
      "type"
    ],
    "additionalProperties": false,
    "if": {
      "properties": {
        "type": {
          "const": "object"
        }
      }
    },
    "then": {
      "required": [
        "properties"
      ]
    },
    "$defs": {
      "schema_definition": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "object",
              "array",
              "string",
              "number",
              "boolean",
              "null"
            ]
          },
          "properties": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/$defs/schema_definition"
            }
          },
          "items": {
            "anyOf": [
              {
                "$ref": "#/$defs/schema_definition"
              },
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/schema_definition"
                }
              }
            ]
          },
          "required": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "additionalProperties": {
            "type": "boolean"
          }
        },
        "required": [
          "type"
        ],
        "additionalProperties": false,
        "sqlTables": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name of the table"
              },
              "definition": {
                "type": "string",
                "description": "SQL CREATE TABLE statement"
              }
            },
            "required": ["name", "definition"]
          }
        },
        "sqlQueries": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name/description of the query"
              },
              "query": {
                "type": "string",
                "description": "Example SQL query"
              }
            },
            "required": ["name", "query"]
          }
        }
        "if": {
          "properties": {
            "type": {
              "const": "object"
            }
          }
        },
        "then": {
          "required": [
            "properties"
          ]
        }
      }
    }
  }
}
```

These are two examples of METADATA:
## Example 1:
Output: ```json
{
  "id": "shinkai-tool-coinbase-create-wallet",
  "name": "Shinkai: Coinbase Wallet Creator",
  "description": "Tool for creating a Coinbase wallet",
  "author": "Shinkai",
  "keywords": [
    "coinbase",
    "wallet",
    "creator",
    "shinkai"
  ],
  "configurations": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "privateKey": { "type": "string" },
      "useServerSigner": { "type": "string", "default": "false", "nullable": true },
    },
    "required": [
      "name",
      "privateKey"
    ]
  },
  "parameters": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "result": {
    "type": "object",
    "properties": {
      "walletId": { "type": "string", "nullable": true },
      "seed": { "type": "string", "nullable": true },
      "address": { "type": "string", "nullable": true },
    },
    "required": []
  },
  "sqlTables": [
    {
      "name": "wallets",
      "definition": "CREATE TABLE wallets (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL, private_key TEXT NOT NULL, address VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get wallet by address",
      "query": "SELECT * FROM wallets WHERE address = :address"
    }
  ]
};
```

## Example 2:
Output:```json
{
  "id": "shinkai-tool-download-pages",
  "name": "Shinkai: Download Pages",
  "description": "Downloads one or more URLs and converts their HTML content to Markdown",
  "author": "Shinkai",
  "keywords": [
    "HTML to Markdown",
    "web page downloader",
    "content conversion",
    "URL to Markdown",
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "urls": { "type": "array", "items": { "type": "string" } },
    },
    "required": [
      "urls"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "markdowns": { "type": "array", "items": { "type": "string" } },
    },
    "required": [
      "markdowns"
    ]
  },
  "sqlTables": [
    {
      "name": "downloaded_pages",
      "definition": "CREATE TABLE downloaded_pages (id SERIAL PRIMARY KEY, url TEXT NOT NULL, markdown_content TEXT, downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get page by URL",
      "query": "SELECT * FROM downloaded_pages WHERE url = :url ORDER BY downloaded_at DESC LIMIT 1"
    }
  ]
};
```

# RULE II:
If the code uses shinkaiSqliteQueryExecutor then fill the sqlTables and sqlQueries sections, otherwise these sections are empty.
sqlTables contains the complete table structures, they should be same as in the code.
sqlQueries contains from 1 to 3 examples that show how the data should be retrieved for usage.

# RULE III:
* Return a valid schema for the described JSON, remove trailing commas.
* The METADATA must be in JSON valid format in only one JSON code block and nothing else.
* Output only the METADATA, so the complete Output it's a valid JSON string.
* Any comments, notes, explanations or examples must be omitted in the Output.
* Generate the METADATA for the following source code in the INPUT:

# INPUT:


import { Application, Router } from 'npm:oak@12.5.0';
import * as path from 'https://deno.land/std@0.198.0/path/mod.ts';
import { serveFile } from "https://deno.land/std@0.198.0/http/file_server.ts";
import { shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { storage_path: string, allowed_file_types: string[], max_file_size_mb: number };
type OUTPUT = {};

const createApiForFileSharing = async (storagePath: string, allowedFileTypes: string[], maxFileSizeMB: number) => {
    const app = new Application();
    const router = new Router();

    // Ensure storage path exists
    await Deno.mkdir(storagePath, { recursive: true });

    // Database setup for file metadata
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            size INTEGER NOT NULL,
            path TEXT NOT NULL,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await shinkaiSqliteQueryExecutor(createTableQuery);

    // File upload endpoint
    router.post('/upload', async (context) => {
        const body = context.request.body({ type: 'form-data' });
        const formData = await body.value.read();
        
        for (const [key, value] of formData.entries()) {
            if (value instanceof Deno.FileInfo) continue;
            const file: any = value;
            const filePath = path.join(storagePath, file.filename);

            // Check file type and size
            if (!allowedFileTypes.includes(path.extname(file.filename).toLowerCase())) {
                context.response.status = 400;
                context.response.body = { error: 'Invalid file type' };
                return;
            }
            if (file.size > maxFileSizeMB * 1024 * 1024) {
                context.response.status = 400;
                context.response.body = { error: 'File size exceeds limit' };
                return;
            }

            await Deno.copyFile(file.originalname, filePath);

            // Save file metadata to database
            const insertQuery = `
                INSERT INTO files (name, type, size, path) VALUES (?, ?, ?, ?);
            `;
            await shinkaiSqliteQueryExecutor(insertQuery, [file.filename, file.type, file.size, filePath]);

            context.response.body = { message: 'File uploaded successfully' };
        }
    });

    // File download endpoint
    router.get('/files/:filename', async (context) => {
        const filename = context.params?.filename;
        if (!filename) {
            context.response.status = 400;
            context.response.body = { error: 'Filename is required' };
            return;
        }

        const filePath = path.join(storagePath, filename);
        try {
            await serveFile(context.request, filePath);
        } catch (error) {
            context.response.status = 404;
            context.response.body = { error: 'File not found' };
        }
    });

    // File search endpoint
    router.get('/search', async (context) => {
        const query = context.url.searchParams.get('q');
        if (!query) {
            context.response.status = 400;
            context.response.body = { error: 'Search query is required' };
            return;
        }

        const searchQuery = `
            SELECT * FROM files WHERE name LIKE ?;
        `;
        const results = await shinkaiSqliteQueryExecutor(searchQuery, [`%${query}%`]);
        
        context.response.body = results;
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { storage_path, allowed_file_types, max_file_size_mb } = inputs;
    const app = await createApiForFileSharing(storage_path, allowed_file_types, max_file_size_mb);
    
    // Start the server
    await app.listen({ port: 8000 });

    return {};
}
