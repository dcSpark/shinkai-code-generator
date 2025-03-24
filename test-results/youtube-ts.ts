import { youtubeTranscriptSummarizer } from './shinkai-local-tools.ts'; // Assuming proper function import

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { summary?: string; error?: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { url } = inputs;

    function extract_video_id(url: string): string | null {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:v\/|embed\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async function fetch_transcript(video_id: string): Promise<string[]> {
        try {
            // Assuming a function that internally fetches transcript from youtube.
            // Placeholder as YouTube transcript API functionality.
            // Replace with actual fetching logic if a library provides direct access.
            return []; // Example: await YouTubeTranscriptApi.fetch_transcript(video_id);
        } catch (error) {
            // Handle errors such as network issues or no transcript available
            return [];
        }
    }

    async function get_full_transcript(url: string): Promise<string | null> {
        const videoId = extract_video_id(url);
        if (!videoId) return null;

        const transcriptParts = await fetch_transcript(videoId);
        return transcriptParts.length > 0 ? transcriptParts.join(' ') : null;
    }

    async function process_video(url: string): Promise<OUTPUT> {
        const transcript = await get_full_transcript(url);
        if (!transcript) {
            return { error: "Transcript not available or video ID invalid." };
        }

        try {
            const summaryResult = await youtubeTranscriptSummarizer({ url });
            return { summary: summaryResult.summary };
        } catch (error) {
            return { error: "Could not summarize transcript." };
        }
    }

    return await process_video(url);
}