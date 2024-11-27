
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


import nodemailer from 'npm:nodemailer@6.9.1';
import { google } from 'npm:googleapis@103.0.0';

type CONFIG = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type INPUTS = {
  to: string;
  subject: string;
  body: string;
  attachments?: string[];
};

type OUTPUT = {
  success: boolean;
  message: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { clientId, clientSecret, refreshToken } = config;
  const { to, subject, body, attachments } = inputs;

  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'your-email@gmail.com', // Replace with your email
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    const mailOptions = {
      from: '"Your Name" <your-email@gmail.com>', // Replace with your name and email
      to,
      subject,
      text: body,
      attachments: attachments?.map(filename => ({ path: filename })),
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    /* Error handling */
    return { success: false, message: `Error sending email: ${error.message}` };
  }
}
