export type TEST = { code: string; prompt: string };

export const tests: TEST[] = [{
  code: "download-url",
  prompt: "Generate a tool that downloads urls and converts them to plain text",
}, {
  code: "download-table",
  prompt:
    "Generate a tool that downloads urls and summarizes them and make a table",
}];
