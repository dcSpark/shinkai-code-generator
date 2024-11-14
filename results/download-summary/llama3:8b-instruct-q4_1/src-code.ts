import { shinkaiDownloadPages } from '@shinkai/local-tools';

type CONFIG = {};
type INPUTS = {
  urls: string[];
};
type OUTPUT = {
  tableCsv: string;
  rowsCount: number;
  columnsCount: number;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { urls } = inputs;

  // Download the pages
  const markdowns = await shinkaiDownloadPages(urls);

  // Create a table with the URLs and summaries
  const tableData = [];
  for (const [url, summary] of Object.entries(markdowns)) {
    tableData.push([url, summary]);
  }

  // Convert the table data to CSV
  let tableCsv = 'URL,Summary\n';
  for (const row of tableData) {
    tableCsv += `${row[0]},${row[1]}\n`;
  }

  return {
    tableCsv,
    rowsCount: tableData.length,
    columnsCount: 2,
  };
}