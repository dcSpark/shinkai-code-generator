
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { analyzeSentiment, analyzeEmotion } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = {
  text: string;
  language?: string;
  include_emotion_breakdown?: boolean;
  confidence_threshold?: number;
};
type OUTPUT = {
  sentiment: string;
  emotion_analysis?: Record<string, number>;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { text, language, include_emotion_breakdown, confidence_threshold } = inputs;

  // Analyze sentiment
  const sentimentResult = await analyzeSentiment({ text, language });
  
  let output: OUTPUT = {
    sentiment: sentimentResult.sentiment,
  };

  // Optionally include emotion breakdown
  if (include_emotion_breakdown) {
    const emotionResult = await analyzeEmotion({ text, language });

    // Apply confidence threshold if provided
    if (confidence_threshold !== undefined) {
      for (const [emotion, score] of Object.entries(emotionResult.emotions)) {
        if (score < confidence_threshold) {
          delete emotionResult.emotions[emotion];
        }
      }
    }

    output.emotion_analysis = emotionResult.emotions;
  }

  return output;
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"text":"The product exceeded my expectations and I'm thrilled with the results!","language":"en","include_emotion_breakdown":true,"confidence_threshold":0.7}')
  
  try {
    const program_result = await run({}, {"text":"The product exceeded my expectations and I'm thrilled with the results!","language":"en","include_emotion_breakdown":true,"confidence_threshold":0.7});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

