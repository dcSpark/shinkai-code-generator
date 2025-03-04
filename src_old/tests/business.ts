import { TestData } from "../support/types.ts";

export const businessTests: TestData[] = [
  {
    code: `get-company-valuation`,
    prompt:
      `Generate a tool that can retrieve and analyze a company's current market valuation.`,
    prompt_type: "type INPUT = { company_name: string, detailed?: boolean }",
    inputs: {
      company_name: "Apple Inc",
      detailed: true,
    },
    tools: [
      "local:::shinkai_tool_duckduckgo_search:::shinkai__duckduckgo_search",
      "local:::shinkai_tool_perplexity:::shinkai__perplexity",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
  },
  {
    code: `get-company-history`,
    prompt:
      `Generate a tool that can retrieve and summarize a company's history.`,
    prompt_type: "type INPUT = { company_name: string, year_from?: number }",
    inputs: {
      company_name: "Microsoft",
      year_from: 1975,
    },
    tools: [],
    config: {},
  },
  {
    code: `get-company-news`,
    prompt:
      `Generate a tool that can fetch and analyze recent news about a company.`,
    prompt_type: "type INPUT = { company_name: string, days_back: number }",
    inputs: {
      company_name: "Tesla",
      days_back: 30,
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
    code: `analyze-business-model`,
    prompt:
      `Generate a tool that can analyze and clone a company's business model.`,
    prompt_type: "type INPUT = { company_name: string, industry: string }",
    inputs: {
      company_name: "Airbnb",
      industry: "hospitality",
    },
    tools: [
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::shinkai_tool_download_pages:::shinkai__download_pages",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
  },
];
