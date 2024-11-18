export type TEST = {
  code: string;
  prompt: string;
  inputs: Record<string, unknown>;
  config: Record<string, unknown>;
};

export const tests: TEST[] = [{
  code: "download-url",
  prompt:
    "Generate a tool that downloads urls and converts them to plain text and store them in a sqlite database.",
  inputs: {
    urls: ["https://jhftss.github.io"],
  },
  config: {},
}, {
  code: "download-summary",
  prompt:
    "Generate a tool that downloads urls and summarizes the site and make a table with the (URL, summary) and store them in a sqlite database.",
  inputs: {
    urls: ["https://jhftss.github.io"],
    },
    config: {},
  },
];
