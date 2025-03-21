import { downloadPages } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = {
    url: string;
};
type OUTPUT = {
    markdown: string;
};

/**
 * Function to convert HTML content from a given URL to Markdown format.
 * @param input - Object containing the URL to process.
 * @returns Object containing the converted Markdown.
 */
async function downloadHtmlToMarkdown(input: INPUTS): Promise<OUTPUT> {
    try {
        const response = await downloadPages({ url: input.url });
        return { markdown: response.markdown };
    } catch (error: unknown) {
        // Handle any errors that occur during the download and conversion process
        if (error instanceof Error) {
            return { markdown: `Error processing the URL: ${error.message}` };
        }
        return { markdown: 'Unknown error occurred during URL processing.' };
    }
}

/**
 * Main function to run the task.
 * @param config - Configuration object (unused in this task).
 * @param inputs - Input object containing the URL.
 * @returns Object containing the Markdown representation of the page.
 */
export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    return await downloadHtmlToMarkdown(inputs);
}