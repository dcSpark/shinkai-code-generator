import { TestData } from "../types.ts";

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
    tools: [],
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
    tools: [],
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
    tools: [],
    config: {},
  },
];
