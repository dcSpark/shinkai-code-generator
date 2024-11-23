export type TEST = {
  code: string;
  prompt: string;
  tools: string[];
  inputs: Record<string, unknown>;
  config: Record<string, unknown>;
};

export const tests: TEST[] = [{
  code: "download-url",
  prompt:
    "Generate a tool that downloads urls and converts them to plain text.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: ["local:::shinkai_tool_download_pages:::shinkai__download_pages"],
  config: {},
}, {
  code: "download-sql",
  prompt:
    "Generate a tool that downloads a URL and stores the result in a sqlite database. Then query the database and return the all results.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: [
    "local:::shinkai_tool_download_pages:::shinkai__download_pages",
    "local:::rust_toolkit:::shinkai_sqlite_query_executor",
  ],
  config: {},
}, {
  code: "download-summay",
  prompt:
    "Generate a tool that downloads urls and summarizes the content in 100 characters.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: [
    "local:::shinkai_tool_download_pages:::shinkai__download_pages",
    "local:::rust_toolkit:::shinkai_llm_prompt_processor",
  ],
  config: {},
}];
