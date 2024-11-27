import { TestData } from "../types.ts";

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

export const webTests: TestData[] = [
  {
    code: `analyze-web-traffic`,
    prompt:
      `Generate a tool that can analyze web traffic statistics and keywords for a website.`,
    prompt_type:
      "type INPUT = { website_url: string, date_range: [string, string] }",
    inputs: {
      website_url: "example.com",
      date_range: ["2024-01-01", "2024-03-31"],
    },
    tools: [],
    config: {},
  },
  {
    code: `analyze-seo`,
    prompt:
      `Generate a tool that can provide SEO insights and recommendations for a website.`,
    prompt_type:
      "type INPUT = { website_url: string, competitor_urls?: string[] }",
    inputs: {
      website_url: "example.com",
      competitor_urls: ["competitor1.com", "competitor2.com"],
    },
    tools: [],
    config: {},
  },
  {
    code: `create-pet-website`,
    prompt:
      `Generate a tool that can create and deploy a simple website for a pet.`,
    prompt_type:
      "type INPUT = { pet_name: string, pet_type: string, photos: string[] }",
    inputs: {
      pet_name: "Buddy",
      pet_type: "dog",
      photos: ["/path/to/photo1.jpg", "/path/to/photo2.jpg"],
    },
    tools: [],
    config: {},
  },
  {
    code: `clone-website`,
    prompt:
      `Generate a tool that can clone and analyze a company's website structure.`,
    prompt_type:
      "type INPUT = { website_url: string, include_assets: boolean }",
    inputs: {
      website_url: "example.com",
      include_assets: true,
    },
    tools: [],
    config: {},
  },
  {
    code: `file-sharing-api`,
    prompt:
      `Generate a tool that can create an API for file sharing with search functionality.`,
    prompt_type:
      "type INPUT = { storage_path: string, allowed_file_types: string[], max_file_size_mb: number }",
    inputs: {
      storage_path: "/path/to/storage",
      allowed_file_types: ["pdf", "jpg", "png"],
      max_file_size_mb: 100,
    },
    tools: [],
    config: {},
  },
  {
    code: "download-url-md",
    prompt:
      "Generate a tool that downloads urls as markdowns and return an array of strings as { markdowns: string[] }.",
    inputs: {
      urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
    },
    prompt_type: "type INPUT = { urls: string[] }",
    tools: ["local:::shinkai_tool_download_pages:::shinkai__download_pages"],
    config: {},
    check: checkIfObjectWithArrayAndMatch(/The Nightmare of Apple/),
  },
  {
    code: "download-url-and-sql",
    prompt:
      "Generate a tool that downloads a URL and stores the result in a sqlite database. Then query the database and return the all results as { query_results: any[] }.",
    inputs: {
      urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
    },
    prompt_type: "type INPUT = { urls: string[] }",
    tools: [
      "local:::shinkai_tool_download_pages:::shinkai__download_pages",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    ],
    config: {},
    // check: checkIfArrayAndMatch(/The Nightmare of Apple/),
  },
  {
    code: "download-url-and-summary",
    prompt:
      "Generate a tool that downloads urls and summarizes the content in 100 characters and return an array of strings as { summaries: string[] }.",
    inputs: {
      urls: ["https://jhftss.github.io/The-Nightmare-of-Apple-OTA-Update/"],
    },
    prompt_type: "type INPUT = { urls: string[] }",
    tools: [
      "local:::shinkai_tool_download_pages:::shinkai__download_pages",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
    check: checkIfObjectWithArrayAndMatch(/Apple/),
  },
];
