
<agent_metadata_schema>
  * This is the SCHEMA for the METADATA:
  ```json
    {
    "name": "function",
    "schema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the function"
        },
        "homepage": {
          "type": "string",
          "description": "URL of the homepage"
        },
        "description": {
          "type": "string",
          "description": "A description of what the function does"
        },
        "version": {
          "type": "string",
          "description": "The version of the function"
        },
        "author": {
          "type": "string",
          "description": "The author of the function"
        },
        "keywords": {
          "type": "array",
          "description": "A list of keywords that describe the function",
          "items": {
            "type": "string"
          }
        },
        "runner": {
          "type": "string",
          "enum": ["any", "only_host", "only_docker"],
          "description": "The type of runner required for this tool"
        },
        "operatingSystem": {
          "type": "array",
          "description": "List of supported operating systems",
          "items": {
            "type": "string",
            "enum": ["linux", "macos", "windows"]
          }
        },
        "tool_set": {
          "type": "string",
          "description": "Optional Tool Set identifier"
        },
        "configurations": {
          "$ref": "#/$defs/root_type",
          "description": "A JSON schema that defines the function's configurations"
        },
        "parameters": {
          "$ref": "#/$defs/root_type",
          "description": "A JSON schema that defines the function's parameters"
        },
        "result": {
          "$ref": "#/$defs/root_type",
          "description": "A JSON schema that defines the function's result"
        },
        "sqlTables": {
          "type": "array",
          "description": "A list of SQL tables used by the function",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "The unique name of the SQL table."
              },
              "definition": {
                "type": "string",
                "description": "The SQL Query to create the table"
              },
            },
            "required": ["name", "definition"]
          }
        },
        "sqlQueries": {
          "type": "array",
          "description": "A list of SQL queries used by the function",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "A functional name to describe the SQL query."
              },
              "query": {
                "type": "string",
                "description": "The SQL query to retrieve data from the database."
              },
            },
            "required": ["name", "query"]
          }
        },
        "tools": {
          "type": "array",
          "description": "A list of tools used by the function",
          "items": {
            "type": "string"
          }
        },
        "oauth": {
          "type": "array",
          "description": "A list of OAuth integrations",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "The unique name of the OAuth integration."
              },
              "version": {
                "type": "string",
                "description": "The version of the OAuth integration: 1.0 or 2.0."
              },
              "authorizationUrl": {
                "type": "string",
                "format": "uri",
                "description": "The endpoint to obtain authorization from the resource owner."
              },
              "redirectUrl": {
                "type": "string",
                "format": "uri",
                "description": "The redirect URI for the OAuth integration.",
                "default": "https://secrets.shinkai.com/redirect"
              },
              "responseType": {
                "type": "string",
                "description": "The OAuth 2.0 response type (e.g., 'token').",
                "default": "token"
              },
              "tokenUrl": {
                "type": "string",
                "format": "uri",
                "description": "The endpoint to exchange the authorization grant for an access token."
              },
              "clientId": {
                "type": "string",
                "description": "The client identifier issued to the client during registration."
              },
              "clientSecret": {
                "type": "string",
                "description": "The client secret issued during registration."
              },
              "scopes": {
                "type": "array",
                "description": "A list of scopes required for the integration.",
                "items": {
                  "type": "string"
                }
              },
              "response_type": {
                "type": "string",
                "description": "OAuth response_type parameter.",
                "default": "code"
              }
            },
            "required": [
              "authorizationUrl",
              "clientId",
              "clientSecret"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "name",
        "description",
        "author",
        "keywords",
        "runner",
        "operatingSystem",
        "configurations",
        "parameters",
        "result",
        "sqlTables",
        "sqlQueries",
        "tools",
        "oauth"
      ],
      "additionalProperties": false
    },
    "$defs": {
      "root_type": {
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/schema_definition"
          }
        }
      },
      "schema_definition": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "order": {
            "type": "number"
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
          "type",
          "name",
          "description",
          "order"
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
        }
      }
    }
  }
  ```
</agent_metadata_schema>
<agent_metadata_examples>
  These are two examples of METADATA:
  ## Example 1:
  Output: ```json
  {
    "name": "Coinbase Wallet Creator",
    "homepage": "https://shinkai.com",
    "description": "Tool for creating a Coinbase wallet",
    "author": "@@localhost.sep-shinkai",
    "version": "1.0.0",
    "keywords": [
      "coinbase",
      "wallet",
      "creator",
      "shinkai"
    ],
    "runner": "any",
    "operatingSystem": ["linux", "macos", "windows"],
    "tool_set": "",
    "configurations": {
      "type": "object",
      "properties": {
        "name": { "type": "string", "description": "The name of the function" },
        "privateKey": { "type": "string", "description": "The private key of the function" },
        "useServerSigner": { "type": "string", "default": "false", "nullable": true, "description": "Whether to use the server signer" },
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
        "walletId": { "type": "string", "description": "The ID of the wallet" },
        "seed": { "type": "string", "description": "The seed of the wallet" },
        "address": { "type": "string", "description": "The address of the wallet" },
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
    ],
    "tools": [
      "local:::__official_shinkai:::shinkai_sqlite_query_executor",
      "local:::shinkai_tool_echo:::shinkai_echo"
    ],
    "oauth": [],
    "runner": "any",
    "operatingSystem": ["linux", "macos", "windows"],
    "tool_set": ""
  };
  ```

  ## Example 2:
  Output:```json
  {
    "name": "Download Pages",
    "homepage": "https://shinkai.com",
    "description": "Downloads one or more URLs and sends the html content as markdown to an email address.",
    "author": "@@localhost.sep-shinkai",
    "version": "1.0.0",
    "keywords": [
      "HTML to Markdown",
      "web page downloader",
      "content conversion",
      "URL to Markdown",
    ],
    "runner": "any",
    "operatingSystem": ["linux", "macos", "windows"],
    "tool_set": "",
    "configurations": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "parameters": {
      "type": "object",
      "properties": {
        "urls": { "type": "array", "description": "The URLs to download", "items": { "type": "string", "description": "URL to download" } },
        "email": { "type": "string", "description": "The email to send the markdown to" },
        "subject": { "type": "string", "description": "The subject of the email" },
      },
      "required": [
        "urls"
      ]
    },
    "result": {
      "type": "object",
      "properties": {
        "markdowns": { "type": "array", "items": { "type": "string", "description": "markdown content" }, "description": "The markdown content of the downloaded pages" },
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
    ],
    "tools": [],
    "oauth": [],
    "runner": "any",
    "operatingSystem": ["linux", "macos", "windows"],
    "tool_set": ""
  };
  ```
</agent_metadata_examples>

<agent_metadata_rules>
  * If the code uses shinkaiSqliteQueryExecutor then fill the sqlTables and sqlQueries sections, otherwise these sections are empty.
  * sqlTables contains the complete table structures, they should be same as in the code.
  * sqlQueries contains from 1 to 3 examples that show how the data should be retrieved for usage.
  * If properties from CONFIG have default values, then those properties shouldn't be in the required array.

</agent_metadata_rules>

<available_tools>

</available_tools>

<empty_template>

  {
      "name": "<name>",
      "homepage": "<url>",
      "description": "<description>",
      "author": "@@localhost.sep-shinkai",
      "version": "1.0.0",
      "keywords": [],
      "runner": "any",
      "operatingSystem": ["linux", "macos", "windows"],
      "tool_set": "",
      "configurations": {
        "type": "object",
        "properties": {},
        "required": []
      },
      "parameters": {
        "type": "object",
        "properties": {}
        "required": []
      },
      "result": {
        "type": "object",
        "properties": {}
        "required": []
      },
      "sqlTables": [],
      "sqlQueries": [],
      "tools": []
      
  }

</empty_template>

<agent_metadata_implementation>
  * The main goal is you to generate the METADATA for the following source code in the input_command tag.
  * The METADATA is a JSON object, that is a valid json schema.
  * Output the literal METADATA JSON and NOT a program that generates the JSON.
  * The entire METADATA must be a single valid JSON object.
  * Return a single METADATA in the response, remove trailing commas.
  * Do not use "$ref".
  * Do not split the JSON into multiple code blocks.
  * Only the final METADATA JSON must be fenced as a json block, so we can extract it easily, other blocks can be fenced with other keywords as "markdown", "code", "example", etc.
  * Any comments, notes, explanations or examples must be omitted in the Output.
  * Use the available_tools section to get the list of tools for the METADATA.
  * configuration, parameters and result must be objects, not arrays neither basic types.
  * Use the empty_template as reference for keys, but complete the METADATA based on the rules provided before, and using the input_command tag provided next as the target for the METADATA.
  * The METADATA must represent the input_command tag code.
</agent_metadata_implementation>

<input_command>

</input_command>


