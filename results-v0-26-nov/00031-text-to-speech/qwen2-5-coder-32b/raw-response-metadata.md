```json
{
  "id": "shinkai-tool-text-to-speech",
  "name": "Shinkai: Text to Speech Converter",
  "description": "Converts text to speech and saves it as an MP3 file using espeak.",
  "author": "Shinkai",
  "keywords": [
    "text to speech",
    "espeak",
    "mp3 converter"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "text": { "type": "string" }
    },
    "required": [
      "text"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "filePath": { "type": "string" }
    },
    "required": [
      "filePath"
    ]
  },
  "sqlTables": [],
  "sqlQueries": []
}
```