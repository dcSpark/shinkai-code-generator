```json
{
  "id": "shinkai-tool-camera-cleanup-analysis",
  "name": "Shinkai: Camera Cleanup Analysis",
  "description": "Analyzes camera feed to determine cleanliness and fullness percentage of an area.",
  "author": "Shinkai",
  "keywords": [
    "camera analysis",
    "cleanliness detection",
    "fullness measurement",
    "opencv"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "camera_feed": { "type": "string" },
      "check_interval_minutes": { "type": "number" }
    },
    "required": [
      "camera_feed",
      "check_interval_minutes"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "cleanliness": { "type": "string" },
      "fullness_percentage": { "type": "number" }
    },
    "required": [
      "cleanliness",
      "fullness_percentage"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```