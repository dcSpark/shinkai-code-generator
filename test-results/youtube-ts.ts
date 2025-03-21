import { youtubeTranscriptSummarizer } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { summary: string };

async function fetchYouTubeTranscript(url: string): Promise<{ summary: string }> {
    try {
        // Validate URL (very basic validation just for demonstration purposes)
        if (!url.includes('youtube.com/watch')) {
            throw new Error('Invalid YouTube URL');
        }
        
        // Fetch the transcript summary
        const { summary } = await youtubeTranscriptSummarizer({ url });
        
        // Return the summary
        return { summary };

    } catch (error: unknown) {
        if (error instanceof Error) {
            // Return an error message in case of failure
            return { summary: `Error fetching transcript: ${error.message}` };
        } else {
            return { summary: 'An unknown error occurred.' };
        }
    }
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    // Call the fetchYouTubeTranscript function with the provided URL
    return await fetchYouTubeTranscript(inputs.url);
}