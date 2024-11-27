import { TestData } from "../types.ts";

export const spiritualTests: TestData[] = [
  {
    code: `bible-verse-interpreter`,
    prompt:
      `Generate a tool that can provide random Bible verses and their interpretations.`,
    prompt_type: "type INPUT = { translation?: string, topic?: string }",
    inputs: {
      translation: "NIV",
      topic: "hope",
    },
    tools: [
      "local:::shinkai_tool_duckduckgo_search:::shinkai__duckduckgo_search",
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    ],
    config: {},
  },
  {
    code: `confession-assistant`,
    prompt:
      `Generate a tool that can provide spiritual guidance and confession assistance.`,
    prompt_type: "type INPUT = { confession_text: string, religion: string }",
    inputs: {
      confession_text: "I have not been kind to my neighbor",
      religion: "Catholic",
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
  },
  {
    code: `historical-personality-simulator`,
    prompt:
      `Generate a tool that can simulate conversations with historical figures based on research.`,
    prompt_type:
      "type INPUT = { person_name: string, time_period: string, topic?: string }",
    inputs: {
      person_name: "Albert Einstein",
      time_period: "1920s",
      topic: "relativity",
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    ],
    config: {},
  },
];
