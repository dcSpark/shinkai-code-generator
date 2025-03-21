import { xTwitterSearch, memeGenerator, xTwitterPost } from './shinkai-local-tools.ts';

type CONFIG = {
  twitterApiKey: string;
  twitterApiSecret: string;
};

type INPUTS = {
  username: string;
  joke: string;
};

type OUTPUT = {
  memeUrl: string;
  status: string;
};

async function get_user_mentions(username: string): Promise<any> {
  const result = await xTwitterSearch({
    username,
    command: 'get-user-posts'
  });
  return result.data;
}

async function generate_meme_based_on_joke(joke: string): Promise<string> {
  const result = await memeGenerator({ joke });
  return result.memeUrl;
}

async function post_meme_to_twitter(text: string, imagePath: string): Promise<string> {
  const result = await xTwitterPost({ text, imagePath });
  return result.data;
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  try {
    // Step 1: Retrieve user mentions (if needed in future enhancement)
    const mentions = await get_user_mentions(inputs.username);

    // Step 2: Generate Meme based on the provided joke
    const memeUrl = await generate_meme_based_on_joke(inputs.joke);
    
    // Step 3: Post Meme to Twitter
    const status = await post_meme_to_twitter("Check out this meme!", memeUrl);

    return {
      memeUrl,
      status
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to execute run: ${error.message}`);
    } else {
      throw new Error('Failed to execute run: Unknown error occurred');
    }
  }
}