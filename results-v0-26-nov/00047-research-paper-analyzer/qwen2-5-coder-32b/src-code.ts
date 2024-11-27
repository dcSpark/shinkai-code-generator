import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { paper_urls: string[], focus_areas?: string[] };
type OUTPUT = { summaries: { url: string, summary: string }[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const summarizePaper = async (url: string): Promise<string> => {
        try {
            const response = await axios.get(url);
            const text = response.data;
            // Simple summary logic (placeholder for actual summarization)
            const firstParagraph = text.split('\n').find(line => line.trim().length > 0) || '';
            return `Summary of ${url}: ${firstParagraph.slice(0, 150)}...`;
        } catch (error) {
            return `Failed to fetch or summarize paper from ${url}: ${error.message}`;
        }
    };

    const summaries = await Promise.all(inputs.paper_urls.map(async url => ({
        url,
        summary: await summarizePaper(url)
    })));

    return { summaries };
}