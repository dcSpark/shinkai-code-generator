```json
{
  "id": "shinkai-tool-learning-plan-generator",
  "name": "Shinkai: Learning Plan Generator",
  "description": "Generates a learning plan based on topic, skill level, time available, and learning style",
  "author": "Shinkai",
  "keywords": [
    "learning plan",
    "skill level",
    "time management",
    "learning styles"
  ],
  "configurations": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "parameters": {
    "type": "object",
    "properties": {
      "topic": { "type": "string" },
      "current_skill_level": { "type": "string", "enum": ["beginner", "intermediate", "advanced"], "default": "beginner" },
      "time_available_hours": { "type": "number", "minimum": 0, "default": 10 },
      "learning_style": { "type": "string", "enum": ["visual", "auditory", "reading", "kinesthetic"], "default": "reading" }
    },
    "required": [
      "topic"
    ]
  },
  "result": {
    "type": "object",
    "properties": {
      "plan": { "type": "array", "items": { "type": "string" } }
    },
    "required": [
      "plan"
    ]
  },
  "sqlTables": [
    {
      "name": "learning_plans",
      "definition": "CREATE TABLE learning_plans (topic TEXT, plan TEXT)"
    }
  ],
  "sqlQueries": [
    {
      "name": "Get learning plan by topic",
      "query": "SELECT * FROM learning_plans WHERE topic = :topic"
    },
    {
      "name": "List all learning plans",
      "query": "SELECT * FROM learning_plans"
    }
  ]
}
```