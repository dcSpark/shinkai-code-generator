import { promises as fsPromises } from "fs";
import fetch from "node-fetch";
import { parse } from "markdown-it/lib/parse.js";
import tw from "twig2jsx";

type CONFIG = {};
type INPUTS = {
  urls: string[];
};
type OUTPUT = {
  summaryTable: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const summarizeUrlsAndCreateSummaryTable = async (urls: string[]): Promise<string> => {
    let tableContent = `| URL | Summary |\n| --- | ------- |\n`;
    
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        
        const htmlContent = await response.text();
        const parsedHtml = parse(htmlContent);
        let summary;

        // Assuming the HTML content has a <pre> tag with class 'summary' for simplicity
        if (parsedHtml.nodes[0].type === "block_code" && parsedHtml.nodes[0].attrs[0][1] === "summary") {
          summary = parsedHtml.nodes[0].content;
        const markdownContent = tw(htmlContent, { escape: false }).render();
        
        tableContent += `| ${url} | ${markdownContent} |\n`;
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        continue; // Skip to the next URL if an error occurs
      }
    }
    
    return tableContent;
  };
  
  const urls = inputs.urls;
  const summaryTable = await summarizeUrlsAndCreateSummaryTable(urls);
  
  return { summaryTable };
}