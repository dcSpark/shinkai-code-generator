```json
{
  "id": "shinkai-tool-audio-to-text",
  "name": "Shinkai: Audio to Text Converter",
  "description": "Converts audio files to text using a placeholder tool (whisper.cpp)",
  "author": "Shinkai",
  "keywords": [
    "audio",
    "text conversion",
    "whisper.cpp"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "audio_path": { "type": "string" },
      "language": { "type": "string", "nullable": true },
      "timestamps": { "type": "boolean", "default": false }
    },
    "required": [
      "audio_path"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "text": { "type": "string" }
    },
    "required": [
      "text"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```