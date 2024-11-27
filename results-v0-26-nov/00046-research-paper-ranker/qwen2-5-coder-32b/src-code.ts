import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { topic: string, sort_by: 'citations' | 'relevance' | 'date', limit?: number };
type OUTPUT = { title: string, authors: string[], publication_date: string, citations: number, url: string }[];

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { topic, sort_by, limit = 10 } = inputs;
    
    // Using a mock API endpoint for demonstration purposes
    // Replace with actual research paper database API
    const response = await axios.get(`https://api.mock.com/search`, {
        params: {
            query: topic,
            sortBy: sort_by,
            limit: limit
        }
    });

    return response.data.map((paper: any) => ({
        title: paper.title,
        authors: paper.authors,
        publication_date: paper.publicationDate,
        citations: paper.citations || 0,
        url: paper.url
    }));
}