```json
{
  "id": "shinkai-tool-upcoming-birthdays",
  "name": "Shinkai: Upcoming Birthdays Finder",
  "description": "Tool for finding upcoming birthdays from a calendar within a specified number of days ahead.",
  "author": "Shinkai",
  "keywords": [
    "birthdays",
    "calendar",
    "upcoming events",
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
      "calendar_id": { "type": "string" },
      "days_ahead": { "type": "number" }
    },
    "required": [
      "calendar_id",
      "days_ahead"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "upcoming_birthdays": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "date": { "type": "string" }
          },
          "required": [
            "name",
            "date"
          ]
        }
      }
    },
    "required": [
      "upcoming_birthdays"
    ]
  },
  "sqlTables": [
    {
      "name": "birthdays",
      "definition": "CREATE TABLE birthdays (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, date DATE NOT NULL, calendar_id VARCHAR(255) NOT NULL)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get upcoming birthdays within a specified number of days",
      "query": "SELECT name, date FROM birthdays WHERE calendar_id = ? AND julianday(date) BETWEEN julianday('now') AND julianday('now', '+' || ? || ' days')"
    },
    {
      "name": "Get all birthdays for a specific calendar",
      "query": "SELECT name, date FROM birthdays WHERE calendar_id = ?"
    },
    {
      "name": "Count upcoming birthdays within a specified number of days",
      "query": "SELECT COUNT(*) AS count FROM birthdays WHERE calendar_id = ? AND julianday(date) BETWEEN julianday('now') AND julianday('now', '+' || ? || ' days')"
    }
  ]
}
```