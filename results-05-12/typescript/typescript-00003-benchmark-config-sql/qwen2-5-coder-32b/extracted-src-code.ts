import { shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {
  api_key: string;
};

type INPUTS = {
  prompt: string;
};

type OUTPUT = {};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.api_key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": inputs.prompt}]
    })
  });

  const data = await response.json();

  // Create table if not exists
  await shinkaiSqliteQueryExecutor('default', `
    CREATE TABLE IF NOT EXISTS openai_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert the response into the database
  await shinkaiSqliteQueryExecutor('default', `
    INSERT INTO openai_responses (prompt, response) 
    VALUES (?, ?)
  `, [inputs.prompt, JSON.stringify(data)]);

  return {};
}