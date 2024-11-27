
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';
import cheerio from 'npm:cheerio@1.0.1-0';
import * as fs from 'https://deno.land/std@0.193.0/fs/mod.ts';

type CONFIG = {};
type INPUTS = { website_url: string, include_assets: boolean };
type OUTPUT = { structure: any };

async function fetchHTML(url: string): Promise<string> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch the URL ${url}: ${error.message}`);
    }
}

function parseHTML(html: string, includeAssets: boolean): any {
    const $ = cheerio.load(html);
    const structure = {};

    function traverse(element: Cheerio<any>, path: string[]) {
        const tagName = $(element).prop('tagName').toLowerCase();
        if (!structure[path.join('/')]) {
            structure[path.join('/')] = [];
        }

        const elementData = { tag: tagName };

        if (includeAssets) {
            if (tagName === 'link') {
                elementData['href'] = $(element).attr('href');
            } else if (tagName === 'script') {
                elementData['src'] = $(element).attr('src');
            }
        }

        structure[path.join('/')].push(elementData);

        $(element).children().each((_, child) => traverse(child, [...path, tagName]));
    }

    $('body').contents().each((_, child) => traverse(child, ['body']));
    return structure;
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { website_url, include_assets } = inputs;

    const html = await fetchHTML(website_url);
    const parsedStructure = parseHTML(html, include_assets);

    return { structure: parsedStructure };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"website_url":"example.com","include_assets":true}')
  
  try {
    const program_result = await run({}, {"website_url":"example.com","include_assets":true});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

