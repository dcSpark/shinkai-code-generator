import { xTwitterSearch, memeGenerator, xTwitterPost } from './shinkai-local-tools.ts';

type CONFIG = {
    twitterApiKey: string;
    twitterApiSecret: string;
};

type INPUTS = {
    username: string;
    searchQuery: string;
};

// Adjusted OUTPUT to include a more specific mention type if needed.
type MENTION = {
    text: string;
};

type OUTPUT = {
    message: string;
    imagePath: string;
};

export async function fetchUserMentions(username: string, searchQuery: string): Promise<MENTION[]> {
    try {
        const result = await xTwitterSearch({
            command: 'get-user-posts',
            username: username,
            searchQuery: searchQuery
        });
        return result.data as MENTION[]; // Ensure the result is typed correctly as MENTION[]
    } catch (error) {
        console.error('Error fetching mentions:', error);
        throw new Error('Failed to fetch user mentions.');
    }
}

export async function generateMeme(joke: string) {
    try {
        const memeResult = await memeGenerator({ joke });
        return memeResult.memeUrl;
    } catch (error) {
        console.error('Error generating meme:', error);
        throw new Error('Failed to generate meme.');
    }
}

export async function postMemeResponse(imagePath: string, text: string) {
    try {
        const postResult = await xTwitterPost({ imagePath, text });
        return postResult.data;
    } catch (error) {
        console.error('Error posting meme response:', error);
        throw new Error('Failed to post meme response.');
    }
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { username, searchQuery } = inputs;
    try {
        const mentions = await fetchUserMentions(username, searchQuery);
        const joke = mentions.length > 0 ? mentions[0].text : "Why did the chicken join a band? Because it had the drumsticks!";
        const memeUrl = await generateMeme(joke);
        const responseMessage = "Check out this awesome meme!";
        await postMemeResponse(memeUrl, responseMessage);

        return { message: responseMessage, imagePath: memeUrl };
    } catch (error) {
        console.error('Error in run process:', error);
        throw new Error('Failed to execute run process.');
    }
}