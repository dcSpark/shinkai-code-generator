export type TEST = {
  code: string;
  prompt: string;
  tools: string[];
  inputs: Record<string, unknown>;
  config: Record<string, unknown>;
  check?: (output: string) => number; // between 0 and 1
};

const checkIfObjectWithArrayAndMatch =
  (expected: RegExp) => (output: string): number => {
    const checkIfArrayAndMatch = (
      arr: unknown,
      match: RegExp,
    ): number | null => {
      if (Array.isArray(arr)) {
        if (arr.length === 1 && arr[0].match(match)) {
          return 1;
        }
        return 0.5;
      }
      return null;
    };

    const tryToParse = (o: string): object | null => {
      try {
        return JSON.parse(o);
      } catch (_) {
        return null;
      }
    };

    if (!output) return 0;
    const o = tryToParse(output);
    if (o && Object.keys(o).length > 0) {
      if (Array.isArray(o)) {
        return 0.1;
      }
      const match = Object.keys(o).map((item) => {
        const result = checkIfArrayAndMatch(
          o[item as keyof typeof o],
          expected,
        );
        return result;
      }).find((x) => x);
      if (match) return match;
    }

    return 0;
  };

export const tests: TEST[] = [{
  code: "download-url-md",
  prompt:
    "Generate a tool that downloads urls as markdowns and return an array of strings as { markdowns: string[] }.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: ["local:::shinkai_tool_download_pages:::shinkai__download_pages"],
  config: {},
  check: checkIfObjectWithArrayAndMatch(/The Nightmare of Apple/),
}, {
  code: "download-url-and-sql",
  prompt:
    "Generate a tool that downloads a URL and stores the result in a sqlite database. Then query the database and return the all results as { query_results: any[] }.",
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
    "Generate a tool that downloads urls and summarizes the content in 100 characters and return an array of strings as { summaries: string[] }.",
  inputs: {
    urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
  },
  tools: [
    "local:::shinkai_tool_download_pages:::shinkai__download_pages",
    "local:::rust_toolkit:::shinkai_llm_prompt_processor",
  ],
  config: {},
  check: checkIfObjectWithArrayAndMatch(/Apple/),
}];
