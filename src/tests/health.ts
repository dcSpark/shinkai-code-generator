import { TestData } from "../support/types.ts";

export const healthTests: TestData[] = [
  {
    code: `medical-record-analyzer`,
    prompt:
      `Generate a tool that can analyze medical records and suggest potential diagnoses and solutions.`,
    prompt_type:
      "type INPUT = { records: Array<{date: string, symptoms: string[], diagnosis?: string}> }",
    inputs: {
      records: [
        {
          date: "2024-01-15",
          symptoms: ["headache", "fatigue"],
          diagnosis: "migraine",
        },
      ],
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    ],
    config: {},
  },
  {
    code: `analyze-appearance`,
    prompt:
      `Generate a tool that can analyze personal photos and provide appearance improvement suggestions.`,
    prompt_type:
      "type INPUT = { image_paths: string[], focus_areas?: string[] }",
    inputs: {
      image_paths: ["/path/to/photo1.jpg", "/path/to/photo2.jpg"],
      focus_areas: ["style", "grooming", "posture"],
    },
    tools: [],
    config: {},
  },
];
