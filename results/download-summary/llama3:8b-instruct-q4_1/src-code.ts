import { shinkaiDownloadPages } from '@shinkai/local-tools';

type CONFIG = {};
type INPUTS = {
  urls: string[];
};
type OUTPUT = {
  summaryTable: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { urls } = inputs;

  // Download pages and summarize the site
  const markdowns = await shinkaiDownloadPages(urls);

  // Create a table with URL and summary
  let summaryTable = 'URL | Summary\n';
  for (const [i, url] of urls.entries()) {
    summaryTable += `${url} | ${markdowns[i]}\n`;
  }

  return { summaryTable };
}