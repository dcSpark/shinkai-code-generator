
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

type CONFIG = {};
type INPUTS = { website_url: string, competitor_urls?: string[] };
type OUTPUT = {
    seoInsights: {
        titleAnalysis: string,
        metaDescriptionAnalysis: string,
        keywordDensity: string,
        mobileFriendliness: string,
        backlinkCount: number
    },
    recommendations: string[]
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { website_url, competitor_urls } = inputs;

    // Helper function to fetch HTML content of a URL
    const fetchHTMLContent = async (url: string) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            return '';
        }
    };

    // Helper function to analyze title
    const analyzeTitle = (htmlContent: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const titleElement = doc.querySelector('title');
        const titleText = titleElement ? titleElement.textContent : '';
        if (!titleText || titleText.length < 10 || titleText.length > 60) {
            return `Title is too short or too long. Current length: ${titleText.length}.`;
        }
        return 'Title is appropriate in length.';
    };

    // Helper function to analyze meta description
    const analyzeMetaDescription = (htmlContent: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const metaDescriptionElement = doc.querySelector('meta[name="description"]');
        const metaDescriptionText = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : '';
        if (!metaDescriptionText || metaDescriptionText.length < 50 || metaDescriptionText.length > 160) {
            return `Meta description is too short or too long. Current length: ${metaDescriptionText.length}.`;
        }
        return 'Meta description is appropriate in length.';
    };

    // Helper function to check mobile-friendliness
    const checkMobileFriendliness = async (url: string) => {
        try {
            const response = await axios.get(`https://search.google.com/search-console/v1/urlTestingTools/mobileFriendlyTest/run?key=YOUR_API_KEY`, {
                params: { url }
            });
            return response.data.mobileFriendliness === 'MOBILE_FRIENDLY' ? 'Website is mobile-friendly.' : 'Website is not mobile-friendly.';
        } catch (error) {
            console.error(`Failed to check mobile-friendliness for ${url}:`, error);
            return 'Could not determine mobile-friendliness due to an error.';
        }
    };

    // Helper function to estimate backlink count
    const estimateBacklinkCount = async (url: string) => {
        try {
            const response = await axios.get(`https://api.majestic.com/api/json?app_api_key=YOUR_API_KEY&cmd=getBackLinkData&items=10&datasource=fresh&url=${encodeURIComponent(url)}`);
            return response.data.data[0].ExtBackLinks;
        } catch (error) {
            console.error(`Failed to estimate backlink count for ${url}:`, error);
            return 0;
        }
    };

    const mainWebsiteContent = await fetchHTMLContent(website_url);

    const seoInsights = {
        titleAnalysis: analyzeTitle(mainWebsiteContent),
        metaDescriptionAnalysis: analyzeMetaDescription(mainWebsiteContent),
        keywordDensity: 'Keyword density analysis requires specific keywords and is not implemented here.',
        mobileFriendliness: await checkMobileFriendliness(website_url),
        backlinkCount: await estimateBacklinkCount(website_url)
    };

    const recommendations = [];
    if (seoInsights.titleAnalysis !== 'Title is appropriate in length.') {
        recommendations.push('Optimize the title tag for better SEO.');
    }
    if (seoInsights.metaDescriptionAnalysis !== 'Meta description is appropriate in length.') {
        recommendations.push('Optimize the meta description for better SEO.');
    }
    if (seoInsights.mobileFriendliness === 'Website is not mobile-friendly.') {
        recommendations.push('Make the website mobile-friendly to improve user experience and rankings.');
    }
    if (seoInsights.backlinkCount < 10) {
        recommendations.push('Work on building more backlinks from reputable sites.');
    }

    return { seoInsights, recommendations };
}
