import { TestData } from "../types.ts";

export const developmentTests: TestData[] = [
  {
    code: `deploy-hello-world-api`,
    prompt:
      `Generate a tool that can create and deploy a simple Hello World API.`,
    prompt_type: "type INPUT = { platform: string, api_name: string }",
    inputs: {
      platform: "vercel",
      api_name: "hello-world-api",
    },
    tools: [],
    config: {},
  },
  {
    code: `execute-python`,
    prompt:
      `Generate a tool that can safely execute Python code and return results.`,
    prompt_type: "type INPUT = { code: string, timeout_seconds?: number }",
    inputs: {
      code: "print('Hello, World!')",
      timeout_seconds: 30,
    },
    tools: [],
    config: {},
  },
  {
    code: `webpage-scraper-docker`,
    prompt:
      `Generate a tool that can create and run a Dockerfile for web scraping.`,
    prompt_type:
      "type INPUT = { target_url: string, data_selectors: string[], output_format: string }",
    inputs: {
      target_url: "example.com",
      data_selectors: [".title", ".content"],
      output_format: "json",
    },
    tools: [],
    config: {},
  },
  {
    code: `html-game-creator`,
    prompt:
      `Generate a tool that can create a simple browser-based game using HTML and JavaScript.`,
    prompt_type:
      "type INPUT = { game_type: string, difficulty: 'easy' | 'medium' | 'hard' }",
    inputs: {
      game_type: "platformer",
      difficulty: "easy",
    },
    tools: [],
    config: {},
  },
  {
    code: `create-ai-agent`,
    prompt:
      `Generate a tool that can create a customizable AI agent for various tasks.`,
    prompt_type: "type INPUT = { capabilities: string[], personality: string }",
    inputs: {
      capabilities: ["text_generation", "image_analysis", "data_processing"],
      personality: "helpful and professional",
    },
    tools: [],
    config: {},
  },
];
