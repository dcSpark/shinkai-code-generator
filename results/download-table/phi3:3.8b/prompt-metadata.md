# RULE I:
This is the SCHEMA for the METADATA:
```json
META_SCHEMA = {
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
```json
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
    "required": [],
  },
  "result": {
    "type": "object",
    "properties": {
      "walletId": { "type": "string", "nullable": true },
      "seed": { "type": "string", "nullable": true },
      "address": { "type": "string", "nullable": true },
    },
    "required": [],
  }
};
```

## Example 2:
```json
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
    "required": [],
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
  }
};
```

# RULE II:
* Return a valid schema for the described JSON.
* The METADATA must be in JSON format.
* Output only the METADATA, so the complete Output it's a valid JSON string.
* Any comments, notes, explanations or examples must be omitted in the Output.
* Generate the METADATA for the following typescript source code in the INPUT:

# INPUT:
```typescript
type CONFIG = {};
type INPUTS = {
  url: string;
};
type OUTPUT = {
  plaintext: string;
};

async function main(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { url } = inputs;

  const axios = require(axios);
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return {
        plaintext: response.data,
      };
    }
  } catch (error) {
    console.error(error);
  }

  return {};
}
```
import { promises as fsPromises } from "fs";
import fetch from "node-fetch";
import { parse } from "markdown-it/lib/parse.js";
import tw from "twig2jsx";

type CONFIG = {};
type INPUTS = {
  urls: string[];
};
type OUTPUT = {
  summaryTable: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const summarizeUrlsAndCreateSummaryTable = async (urls: string[]): Promise<string> => {
    let tableContent = `| URL | Summary |\n| --- | ------- |\n`;
    
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        
        const htmlContent = await response.text();
        const parsedHtml = parse(htmlContent);
        let summary;

        // Assuming the HTML content has a <pre> tag with class 'summary' for simplicity
        if (parsedHtml.nodes[0].type === "block_code" && parsedHtml.nodes[0].attrs[0][1] === "summary") {
          summary = parsedHtml.nodes[0].content;
        const markdownContent = tw(htmlContent, { escape: false }).render();
        
        tableContent += `| ${url} | ${markdownContent} |\n`;
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        continue; // Skip to the next URL if an error occurs
      }
    }
    
    return tableContent;
  };
  
  const urls = inputs.urls;
  const summaryTable = await summarizeUrlsAndCreateSummaryTable(urls);
  
  return { summaryTable };
}
