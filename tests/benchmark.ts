import { tool_router_key } from "../test-engine/shinak-api.ts";
import { TestData } from "../types.ts";

// Impossible to implement
const testNoTools = {
  code: `benchmark-impossible`,
  prompt:
    `Generate a tool that creates a post in Facebook, X/Twitter, Instagram and Reddit.`,
  prompt_type: "type INPUT = { title: string, content: string }",
  inputs: {
    title: "Test",
    content: "Test",
  },
  tools: [],
  config: {},
};
// This test downloads a website and returns the HTML as a string.
const test0 = {
  code: `benchmark-download-website`,
  prompt:
    `Generate a tool that downloads a website, and return the complete HTML as { content: string }.`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
  },
  tools: [],
  config: {},
  check: (result: string) => {
    return result.includes("This is a static site") ? 1 : 0;
  },
  save: true,
};
// This tests stores the website in a sqlite database.
const test1 = {
  code: `benchmark-store-website`,
  prompt:
    `Generate a tool that stores or updates a website content in a sqlite database, and returns the entire table`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
  },
  tools: [
    "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    tool_router_key(test0),
  ],
  config: {},
  check: (result: string) => {
    return result.includes("This is a static site") ? 1 : 0;
  },
  save: true,
};
// This test reads the website content from the sqlite database and generates a summary.
const test2 = {
  code: `benchmark-summarize-website`,
  prompt:
    `Generate a tool that reads the website content from the sqlite database and generates a summary.`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
  },
  tools: [
    "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    tool_router_key(test1),
  ],
  config: {},
  check: (result: string) => {
    return result.includes("static") ? 1 : 0;
  },
  save: true,
};
const basic_tool = {
  code: `benchmark-basic-tool`,
  prompt: `Generate a tool that calls a New foobar tool from template.`,
  prompt_type: "type INPUT = {}",
  inputs: {},
  tools: ["local:::shinkai_tool_foobar:::shinkai__foobar"],
  config: {},
};

export const benchmarkTests: TestData[] = [
  basic_tool,
  test0,
  test1,
  test2,
  testNoTools,
];
