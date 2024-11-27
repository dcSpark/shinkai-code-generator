import { TestData } from "../types.ts";

export const travelTests: TestData[] = [
  {
    code: `plan-trip`,
    prompt:
      `Generate a tool that can plan a complete trip itinerary to a destination.`,
    prompt_type:
      "type INPUT = { destination: string, duration_days: number, budget?: number }",
    inputs: {
      destination: "Tokyo, Japan",
      duration_days: 7,
      budget: 2000,
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::shinkai_tool_download_pages:::shinkai__download_pages",
      "local:::shinkai_tool_json_to_md:::shinkai__json_to_md",
    ],
    config: {},
  },
  {
    code: `plan-pet-friendly-trip`,
    prompt: `Generate a tool that can plan a pet-friendly trip itinerary.`,
    prompt_type:
      "type INPUT = { destination: string, duration_days: number, pet_type: string }",
    inputs: {
      destination: "Portland, Oregon",
      duration_days: 5,
      pet_type: "dog",
    },
    tools: [
      "local:::shinkai_tool_duckduckgo_search:::shinkai__duckduckgo_search",
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
      "local:::shinkai_tool_weather_by_city:::shinkai__weather_by_city",
    ],
    config: {},
  },
  {
    code: `plan-dietary-restricted-trip`,
    prompt:
      `Generate a tool that can plan a trip considering dietary restrictions.`,
    prompt_type:
      "type INPUT = { destination: string, duration_days: number, dietary_restrictions: string[] }",
    inputs: {
      destination: "Barcelona, Spain",
      duration_days: 6,
      dietary_restrictions: ["vegan", "gluten-free"],
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    ],
    config: {},
  },
  {
    code: `plan-budget-trip`,
    prompt: `Generate a tool that can plan a budget-friendly trip itinerary.`,
    prompt_type:
      "type INPUT = { destination: string, duration_days: number, max_budget: number }",
    inputs: {
      destination: "Bangkok, Thailand",
      duration_days: 10,
      max_budget: 500,
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
      "local:::shinkai_tool_weather_by_city:::shinkai__weather_by_city",
      "local:::shinkai_tool_download_pages:::shinkai__download_pages",
    ],
    config: {},
  },
];
