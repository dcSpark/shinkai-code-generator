
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { execSync } from 'node:child_process';

type CONFIG = {};
type INPUTS = { target_url: string, data_selectors: string[], output_format: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { target_url, data_selectors, output_format } = inputs;

    // Create a Dockerfile for web scraping
    const dockerfilePath = './Dockerfile';
    const scriptPath = './scrape.js';

    const dockerfileContent = `
FROM node:18

WORKDIR /app

COPY . .

RUN npm install puppeteer

CMD ["node", "scrape.js"]
`;

    const scrapeScriptContent = `
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('${target_url}');

    const data = await page.evaluate(selectors => {
        return selectors.map(selector => document.querySelector(selector)?.innerText);
    }, ${JSON.stringify(data_selectors)});

    console.log('Scraped Data:', data);

    // Convert data to desired output format
    let output;
    switch ('${output_format}') {
        case 'json':
            output = JSON.stringify({ data });
            break;
        default:
            throw new Error('Unsupported output format');
    }

    console.log(output);

    await browser.close();
})();
`;

    try {
        // Write Dockerfile
        Deno.writeTextFileSync(dockerfilePath, dockerfileContent);
        // Write scrape script
        Deno.writeTextFileSync(scriptPath, scrapeScriptContent);

        // Build Docker image
        execSync('docker build -t web-scraper .', { stdio: 'inherit' });
        
        // Run Docker container
        execSync('docker run --rm web-scraper', { stdio: 'inherit' });

        return { success: true, message: 'Docker container executed successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: `An error occurred: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"target_url":"example.com","data_selectors":[".title",".content"],"output_format":"json"}')
  
  try {
    const program_result = await run({}, {"target_url":"example.com","data_selectors":[".title",".content"],"output_format":"json"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

