export type TEST = {
  code: string;
  prompt: string;
  tools: string[];
  inputs: Record<string, unknown>;
  config: Record<string, unknown>;
  check?: (output: unknown) => number; // between 0 and 1
};

const checkIfArrayAndMatch = (expected: RegExp) => (output: unknown): number => {
  const checkIfArrayAndMatch = (arr: unknown, match: RegExp): number | null => {
    if (Array.isArray(arr)) {
      if (arr.length === 1 && arr[0].match(match)) {
        return 1;
      }
      return 0.5;
    }
    return null;
  }
  const exactMatch = checkIfArrayAndMatch(output, expected);
  if (exactMatch) return exactMatch;  
  if (output && typeof output === "object" && Object.keys(output).length > 0) {
    const result = Object.keys(output).map(key => checkIfArrayAndMatch(output[key as keyof typeof output], expected)).find(x => x);
    if (result) return result * 0.75;
  }
  return 0;
}

export const tests: TEST[] = [{
  code: "download-url",
  prompt:
    "Generate a tool that downloads urls and return an array of strings.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: ["local:::shinkai_tool_download_pages:::shinkai__download_pages"],
  config: {},
  check: checkIfArrayAndMatch(/The Nightmare of Apple/),
}, {
  code: "download-url-and-sql",
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
  // check: checkIfArrayAndMatch(/The Nightmare of Apple/),
}, {
  code: "download-url-and-summary",
  prompt:
    "Generate a tool that downloads urls and summarizes the content in 100 characters and return an array of strings.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: [
    "local:::shinkai_tool_download_pages:::shinkai__download_pages",
    "local:::rust_toolkit:::shinkai_llm_prompt_processor",
  ],
  config: {},
  check: checkIfArrayAndMatch(/Apple/),
}];
