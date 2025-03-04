export async function run(config: {}, inputs: { url: string }): Promise<{ content: string }> {
    const url = inputs.url;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const htmlContent = await response.text();
        return { content: htmlContent };
    } catch (error) {
        console.error('Error fetching the URL:', error);
        throw error;
    }
}