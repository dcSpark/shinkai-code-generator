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