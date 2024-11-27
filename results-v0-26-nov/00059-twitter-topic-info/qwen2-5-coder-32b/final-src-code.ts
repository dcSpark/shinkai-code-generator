
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { fetchTweetsByTopic } from 'npm:twitter-api-v2@1.38.0';

type CONFIG = {
  bearerToken: string;
};

type INPUTS = {
  topic: string;
  days_back?: number;
};

type OUTPUT = {
  tweets: Array<{
    id: string;
    text: string;
    created_at: string;
    author_id: string;
  }>;
  analysis: {
    totalTweets: number;
    averageTweetLength: number;
  };
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { topic, days_back = 7 } = inputs;
  const client = new fetchTweetsByTopic({ bearerToken: config.bearerToken });

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days_back);

  const tweets = await client.v2.search(topic, {
    start_time: startDate.toISOString(),
    end_time: endDate.toISOString(),
    max_results: 100,
  });

  const tweetData = tweets.data.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.created_at,
    author_id: tweet.author_id,
  }));

  const totalTweets = tweetData.length;
  const averageTweetLength = totalTweets > 0
    ? tweetData.reduce((sum, tweet) => sum + tweet.text.length, 0) / totalTweets
    : 0;

  return {
    tweets: tweetData,
    analysis: {
      totalTweets,
      averageTweetLength,
    },
  };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"topic":"artificial intelligence","days_back":7}')
  
  try {
    const program_result = await run({}, {"topic":"artificial intelligence","days_back":7});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

