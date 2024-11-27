```json
{
  "id": "shinkai-tool-seo-insights",
  "name": "Shinkai: SEO Insights Analyzer",
  "description": "Tool for analyzing SEO insights of a website and its competitors",
  "author": "Shinkai",
  "keywords": [
    "SEO",
    "website analysis",
    "title analysis",
    "meta description analysis",
    "mobile friendliness",
    "backlink count"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "website_url": { "type": "string" },
      "competitor_urls": { "type": "array", "items": { "type": "string" }, "nullable": true }
    },
    "required": [
      "website_url"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "seoInsights": {
        "type": "object",
        "properties": {
          "titleAnalysis": { "type": "string" },
          "metaDescriptionAnalysis": { "type": "string" },
          "keywordDensity": { "type": "string" },
          "mobileFriendliness": { "type": "string" },
          "backlinkCount": { "type": "number" }
        },
        "required": [
          "titleAnalysis",
          "metaDescriptionAnalysis",
          "keywordDensity",
          "mobileFriendliness",
          "backlinkCount"
        ]
      },
      "recommendations": { "type": "array", "items": { "type": "string" } }
    },
    "required": [
      "seoInsights",
      "recommendations"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```