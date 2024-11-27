```json
{
  "id": "shinkai-tool-video-to-audio",
  "name": "Shinkai: Video to Audio Converter",
  "description": "Converts video files to audio formats using FFmpeg and stores metadata in a SQLite database.",
  "author": "Shinkai",
  "keywords": [
    "video conversion",
    "audio extraction",
    "ffmpeg",
    "sqlite"
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
      "output_format": { "type": "string", "enum": ["mp3", "wav", "aac", "m4a"] },
      "bitrate": { "type": "string" }
    },
    "required": [
      "video_path"
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
  "sqlTables": [
    {
      "name": "audio_files",
      "definition": "CREATE TABLE audio_files (id INTEGER PRIMARY KEY AUTOINCREMENT, video_path TEXT NOT NULL, output_file TEXT NOT NULL, format TEXT NOT NULL, bitrate TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get all audio files",
      "query": "SELECT * FROM audio_files"
    },
    {
      "name": "Get audio file by video path",
      "query": "SELECT * FROM audio_files WHERE video_path = :video_path"
    },
    {
      "name": "Delete audio file by ID",
      "query": "DELETE FROM audio_files WHERE id = :id"
    }
  ]
}
```