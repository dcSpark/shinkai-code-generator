type CONFIG = {
  urls: string[];
};

type INPUTS = {};

type OUTPUT = {
  summaryTable: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { urls } = config;

  const summaries: string[] = [];
  for (const url of urls) {
    const response = await fetch(url);
    const html = await response.text();
    const summary = await summarizeHtml(html);
    summaries.push(summary);
  }

  const summaryTable = createSummaryTable(summaries);

  return { summaryTable };
}

async function summarizeHtml(html: string): Promise<string> {
  // Implement your own summarization logic here
  // For example, you can use a library like `dompurify` to clean the HTML
  // and then extract the main content using a regex or a parsing library
  return "Summary of the page";
}

function createSummaryTable(summaries: string[]): string {
  const table = "Summary Table:\n";
  for (const summary of summaries) {
    table += `* ${summary}\n`;
  }
  return table;
}