import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { task: string, constraints?: string[] };
type OUTPUT = { recommendedMethods: string[], researchSummary: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { task, constraints } = inputs;
    let query = `Best methods for accomplishing ${task}`;

    if (constraints && constraints.length > 0) {
        query += ` with constraints: ${constraints.join(', ')}`;
    }

    try {
        // Using a placeholder API for demonstration purposes
        const response = await axios.get(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
        const data = response.data;

        /* Assuming the API returns an array of results with 'method' and 'summary' fields */
        const recommendedMethods = data.results.map((result: any) => result.method);
        const researchSummary = data.summary || 'No specific summary provided.';

        return { recommendedMethods, researchSummary };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { recommendedMethods: [], researchSummary: 'Failed to retrieve recommendations.' };
    }
}