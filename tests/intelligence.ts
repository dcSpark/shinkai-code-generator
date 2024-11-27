import { TestData } from "../types.ts";

export const intelligenceTests: TestData[] = [
  {
    code: `research-learning`,
    prompt: `Research and create a learning plan for a given topic or skill.`,
    prompt_type: `type INPUT = { 
      topic: string,
      current_skill_level?: "beginner" | "intermediate" | "advanced",
      time_available_hours?: number,
      learning_style?: "visual" | "auditory" | "reading" | "kinesthetic"
    }`,
    inputs: {
      topic: "machine learning",
      current_skill_level: "beginner",
      time_available_hours: 10,
      learning_style: "visual",
    },
    tools: [
      "local:::shinkai_tool_perplexity:::shinkai__perplexity",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    ],
    config: {},
  },
  {
    code: `strategy-application`,
    prompt:
      `Apply a given strategy or methodology to accomplish a specific task.`,
    prompt_type: `type INPUT = {
      strategy: string,
      task: string,
      constraints?: string[],
      resources?: string[]
    }`,
    inputs: {
      strategy: "Agile methodology",
      task: "Develop a mobile app",
      constraints: ["2-month deadline", "3-person team"],
      resources: ["React Native", "Firebase"],
    },
    tools: [],
    config: {},
  },
  {
    code: `sentiment-analysis`,
    prompt: `Analyze the sentiment and emotional tone of a given text.`,
    prompt_type: `type INPUT = {
      text: string,
      language?: string,
      include_emotion_breakdown?: boolean,
      confidence_threshold?: number
    }`,
    inputs: {
      text:
        "The product exceeded my expectations and I'm thrilled with the results!",
      language: "en",
      include_emotion_breakdown: true,
      confidence_threshold: 0.7,
    },
    tools: [],
    config: {},
  },
  {
    code: `text-categorization`,
    prompt:
      `Categorize text content into predefined or dynamically determined categories.`,
    prompt_type: `type INPUT = {
      text: string,
      predefined_categories?: string[],
      auto_categorize?: boolean,
      max_categories?: number
    }`,
    inputs: {
      text:
        "Bitcoin price surges 10% as major institutions increase cryptocurrency investments",
      predefined_categories: [
        "finance",
        "technology",
        "cryptocurrency",
        "business",
      ],
      auto_categorize: true,
      max_categories: 3,
    },
    tools: [],
    config: {},
  },
];
