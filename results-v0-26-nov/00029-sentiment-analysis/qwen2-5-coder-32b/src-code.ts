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