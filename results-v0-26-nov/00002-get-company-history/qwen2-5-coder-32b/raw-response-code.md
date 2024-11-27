```typescript
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { company_name: string, year_from?: number };
type OUTPUT = { summary: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { company_name, year_from } = inputs;
    let query = `history of ${company_name}`;
    
    if (year_from !== undefined) {
        query += ` since ${year_from}`;
    }

    try {
        const response = await axios.get('https://api.openai.com/v1/engines/davinci-codex/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            },
            data: {
                prompt: query,
                max_tokens: 500
            }
        });

        const summary = response.data.choices[0].text.trim();
        return { summary };
    } catch (error) {
        /* Error handling can be improved based on specific requirements */
        return { summary: `Failed to retrieve history for ${company_name}. Please try again later.` };
    }
}
```