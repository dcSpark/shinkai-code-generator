```json
{
  "id": "shinkai-tool-sync-subtitles",
  "name": "Shinkai: Sync Subtitles with Video",
  "description": "Synchronizes subtitle timestamps with the duration of a video file.",
  "author": "Shinkai",
  "keywords": [
    "subtitle synchronization",
    "video duration",
    "subtitles adjustment"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "video_path": { "type": "string" },
      "subtitle_path": { "type": "string" }
    },
    "required": [
      "video_path",
      "subtitle_path"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "success": { "type": "boolean" },
      "message": { "type": "string" }
    },
    "required": [
      "success",
      "message"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```