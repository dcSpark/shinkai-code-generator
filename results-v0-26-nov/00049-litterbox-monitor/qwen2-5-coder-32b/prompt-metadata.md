
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


import axios from 'npm:axios@1.6.2';
import cv from 'https://esm.sh/@techstark/opencv-js@4.5.1';

type CONFIG = {};
type INPUTS = { camera_feed: string, check_interval_minutes: number };
type OUTPUT = { cleanliness: string, fullness_percentage: number };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { camera_feed, check_interval_minutes } = inputs;

    // Function to analyze the image
    const analyzeImage = async (imageData: Uint8Array): Promise<{ cleanliness: string, fullness_percentage: number }> => {
        cv.onRuntimeInitialized = () => {
            const img = cv.imdecode(cv.matFromImageData(imageData));

            // Convert image to grayscale
            const gray = new cv.Mat();
            cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

            // Apply thresholding to detect solid particles (litter and waste)
            const _, binary = new cv.Mat();
            cv.threshold(gray, binary, 150, 255, cv.THRESH_BINARY);

            // Find contours of the detected areas
            const contours: any[] = [];
            const hierarchy = new cv.Mat();
            cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            // Calculate total area and detected solid particles area
            const totalArea = img.size().width * img.size().height;
            let solidParticlesArea = 0;

            for (let i = 0; i < contours.length; i++) {
                solidParticlesArea += cv.contourArea(contours[i]);
            }

            // Calculate fullness percentage
            const fullness_percentage = (solidParticlesArea / totalArea) * 100;

            // Determine cleanliness based on fullness percentage
            let cleanliness: string;
            if (fullness_percentage < 20) {
                cleanliness = 'very clean';
            } else if (fullness_percentage < 50) {
                cleanliness = 'clean';
            } else if (fullness_percentage < 80) {
                cleanliness = 'moderately dirty';
            } else {
                cleanliness = 'dirty';
            }

            img.delete();
            gray.delete();
            binary.delete();
            contours.forEach(contour => contour.delete());
            hierarchy.delete();

            return { cleanliness, fullness_percentage };
        };

        // Trigger OpenCV initialization
        cv('onRuntimeInitialized', () => {});

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ cleanliness: 'unknown', fullness_percentage: 0 });
            }, 100); // Simulate async behavior, replace with actual processing logic
        });
    };

    const fetchImage = async (url: string): Promise<Uint8Array> => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return new Uint8Array(response.data);
    };

    // Fetch and analyze the image
    const imageData = await fetchImage(camera_feed);
    const result = await analyzeImage(imageData);

    // Schedule next check
    setTimeout(() => run(config, inputs), check_interval_minutes * 60 * 1000);

    return result;
}
