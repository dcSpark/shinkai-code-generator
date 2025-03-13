import { exists } from "jsr:@std/fs/exists";
import axios, { AxiosError } from 'npm:axios';
import { BaseEngine } from './llm-engines.ts';
import { LLMFormatter } from './LLMFormatter.ts';
import { TestFileManager } from "./TestFileManager.ts";
import { Language } from "./types.ts";
const BRAVE_API_KEY = Deno.env.get('BRAVE_API_KEY');
const FIRECRAWL_API_URL = Deno.env.get('FIRECRAWL_API_URL');
const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');

interface BraveSearchResponse {
    query: Query;
    mixed: Mixed;
    type: string;
    web: Web;
}

interface Mixed {
    type: string;
    main: Main[];
    top: any[];
    side: any[];
}

interface Main {
    type: MainType;
    index: number;
    all: boolean;
}

export enum MainType {
    Web = "web",
}

interface Query {
    original: string;
    show_strict_warning: boolean;
    is_navigational: boolean;
    is_news_breaking: boolean;
    spellcheck_off: boolean;
    country: string;
    bad_results: boolean;
    should_fallback: boolean;
    postal_code: string;
    city: string;
    header_country: string;
    more_results_available: boolean;
    state: string;
}

interface Web {
    type: string;
    results: Result[];
    family_friendly: boolean;
}

interface Result {
    title: string;
    url: string;
    is_source_local: boolean;
    is_source_both: boolean;
    description: string;
    language: Lang;
    family_friendly: boolean;
    type: ResultType;
    subtype: string;
    is_live: boolean;
    meta_url: MetaURL;
    thumbnail?: Thumbnail;
    page_age?: Date;
    profile?: Profile;
    age?: string;
}

export enum Lang {
    En = "en",
}

interface MetaURL {
    scheme: Scheme;
    netloc: string;
    hostname: string;
    favicon: string;
    path: string;
}

export enum Scheme {
    HTTPS = "https",
}

interface Profile {
    name: string;
    url: string;
    long_name: string;
    img: string;
}

interface Thumbnail {
    src: string;
    original: string;
    logo: boolean;
}

export enum ResultType {
    SearchResult = "search_result",
}


interface CrawlResponse {
    success: boolean;
    status: string;
    completed: number;
    total: number;
    creditsUsed: number;
    expiresAt: Date;
    data: Datum[];
}

interface Datum {
    markdown: string;
    metadata: Metadata;
}

interface Metadata {
    description: string;
    "theme-color": string;
    "og:image:width": string;
    ogImage: string;
    viewport: string[];
    "og:image:height": string;
    title: string;
    favicon: string;
    ogUrl: string;
    "og:site_name": string;
    ogSiteName: string;
    "og:type": string;
    "og:title": string;
    "og:url": string;
    ogDescription: string;
    "readthedocs-addons-api-version": string;
    ogTitle: string;
    "og:image": string;
    language: string;
    "og:description": string;
    "og:image:alt": string;
    scrapeId: string;
    sourceURL: string;
    url: string;
    statusCode: number;
}

interface CrawlOptions {
    url: string;
    limit?: number;
    scrapeOptions?: {
        formats?: string[];
    };
}

interface CrawlInitResponse {
    success: boolean;
    id: string;
    url: string;
}

interface MapResponse {
    status: string;
    links: string[];
}

interface ScrapeResponse {
    success: boolean;
    data: {
        markdown?: string;
        html?: string;
        metadata: {
            title?: string;
            description?: string;
            language?: string;
            keywords?: string;
            robots?: string;
            ogTitle?: string;
            ogDescription?: string;
            ogUrl?: string;
            ogImage?: string;
            ogLocaleAlternate?: string[];
            ogSiteName?: string;
            sourceURL: string;
            statusCode: number;
        }
    }
}

interface ScrapeOptions {
    url: string;
    formats?: ('markdown' | 'html')[];
}

export class DependencyDoc {
    constructor(private llm: BaseEngine, private logger: TestFileManager | undefined) { }

    private async getURLsFromSearch(searchResponse: BraveSearchResponse, finalQuery: string) {
        const safeFilename = this.toSafeFilename('searchurls_' + finalQuery, 'json');
        if (await exists(Deno.cwd() + '/cache/' + safeFilename)) {
            await this.logger?.log(` getURLsFromScratch for ${finalQuery}`, true);
            return JSON.parse(await Deno.readTextFile(Deno.cwd() + '/cache/' + safeFilename)).links;
        }

        // How to get the best match? trust the first result?
        const url = searchResponse.web.results.find(r => {
            const isCompressedFile = r.url.match(/\.(zip|tar|gz|bz2|rar|7z|iso)$/);
            const isBinaryFile = r.url.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|dmg|pkg|deb|rpm|msi|exe|app|exe|app|pkg|rpm|deb|msi)$/);
            return !isCompressedFile && !isBinaryFile;
        })?.url;
        if (!url) {
            throw new Error('No URL found');
        }

        const urlsString = await new LLMFormatter(this.logger).retryUntilSuccess(async () => {
            const response = await this.llm.run(`
In the search results tag, there is JSON with a internet serach result for the query: "${finalQuery}"
<search_results>
${JSON.stringify(searchResponse.web.results.map(r => ({
                title: r.title,
                url: r.url,
                description: r.description,
            })))}
</search_results>

<rules>
* We want to get the links that may contain the official programming documentation. Ideally the complete documentation.
* Keep only those that might have the documentation. 
* Return the links as a JSON array.
</rules>

<format>
* Output only the JSON array as in the output tag below
<output>
\`\`\`json
["https://URL1", "https://URL2", "https://URL3"]
\`\`\`
</output>
* JSON have valid syntax and only urls.
</format>

            `, this.logger, undefined);
            return response.message;
        }, 'json', { regex: [/^https?:\/\/.*$/], isJSONArray: true });

        const urls: string[] = JSON.parse(urlsString);

        // lets scrape these pages for context
        const context: string[] = [];
        for (const url of urls) {
            const scrape = await this.scrapeWebsite({ url, formats: ['markdown'] });
            const limit = 30000;
            context.push((scrape.data.markdown || '').substring(0, limit));
        }

        // We can get this by extracting the links from the scrape as well...
        const possiblePages: string[] = [];
        for (const url of urls) {
            const map = await this.mapWebsite(url);
            const limit = 250;
            possiblePages.push(...map.slice(0, limit));
        }

        const urlsString2 = await new LLMFormatter(this.logger).retryUntilSuccess(async () => {
            const response = await this.llm.run(`
In the search we have a lot possible pages that contain documentation, there is JSON with a internet serach result for the query: "${finalQuery}"
We have some general incomplete information about the documentation, that is in the context tag below.
<context>
${context.join('\n')}   
</context>

<search_results>
${possiblePages.join('\n')}   
</search_results>

<rules>
* Use the context to get an idea of what possible pages might be important to the documentation, but also asume the context is incomplete.
* We want to get the links that may contain the official programming documentation. Ideally the complete documentation.
* Keep only those that might have the documentation. 
* Return the links as a JSON array.
</rules>

<format>
* Output only the JSON array as in the output tag below
<output>
\`\`\`json
["https://URL1", "https://URL2", "https://URL3"]
\`\`\`
</output>
* JSON have valid syntax and only urls.
</format>

            `, this.logger, undefined);
            return response.message;
        }, 'json', { regex: [/^https?:\/\/.*$/], isJSONArray: true });

        const urls2: string[] = JSON.parse(urlsString2);
        await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify({ links: urls2 }, null, 2));
        return urls2;
    }

    private chunkDocumentation(documentation: string): string[] {
        const chunkSize = 20000;
        const overlapSize = 1000;
        const chunks: string[] = [];

        // If documentation is smaller than chunk size, return as is
        if (documentation.length <= chunkSize) {
            return [documentation];
        }

        let currentPosition = 0;

        while (currentPosition < documentation.length) {
            let chunkEnd = currentPosition + chunkSize;

            // If we're not at the end, find the next word boundary
            if (chunkEnd < documentation.length) {
                // Look forward for a word boundary within next 2000 chars
                const nextSpaceAfterChunk = documentation.indexOf(' ', chunkEnd);
                if (nextSpaceAfterChunk !== -1 && nextSpaceAfterChunk - chunkEnd < 2000) {
                    chunkEnd = nextSpaceAfterChunk;
                }
            }

            // Get the chunk
            let chunk = documentation.slice(
                Math.max(0, currentPosition - (currentPosition > 0 ? overlapSize : 0)),
                Math.min(documentation.length, chunkEnd + (chunkEnd < documentation.length ? overlapSize : 0))
            );

            // Ensure we start and end at word boundaries
            if (currentPosition > 0) {
                const firstSpaceIndex = chunk.indexOf(' ');
                if (firstSpaceIndex !== -1) {
                    chunk = chunk.slice(firstSpaceIndex + 1);
                }
            }

            if (chunkEnd < documentation.length) {
                const lastSpaceIndex = chunk.lastIndexOf(' ');
                if (lastSpaceIndex !== -1) {
                    chunk = chunk.slice(0, lastSpaceIndex);
                }
            }

            chunks.push('...' + chunk + '...');
            currentPosition = chunkEnd;
        }
        return chunks;
    }

    private async postProcessDocumentation(library: string, documentation: string): Promise<string> {
        const safeFilenameOriginal = this.toSafeFilename('doc_original_' + library, 'md');
        await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilenameOriginal, documentation);

        const safeFilename = this.toSafeFilename('doc_postprocess_' + library, 'md');
        if (await exists(Deno.cwd() + '/cache/' + safeFilename)) {
            return await Deno.readTextFile(Deno.cwd() + '/cache/' + safeFilename);
        }

        const chunks = this.chunkDocumentation(documentation);
        const cleanChunks = [];
        for (const [index, chunk] of chunks.entries()) {
            const partialDoc = await new LLMFormatter(this.logger).retryUntilSuccess(async () => {
                const response = await this.llm.run(`
This next documentation tag contains the partial markdown documentation of "${library}" library.
<documentation>
\`\`\`markdown
${chunk}
\`\`\`
</documentation>

<rules>
* Do not rewrite or sythesize, just print the same documentation line by line. 
* If the line has no relation with the documentation, then remove it - for example: ads, sitemaps, web headers, web footers, sponsors, external links that add no value to the documentation.
</rules>

                `, this.logger, undefined);
                return response.message;
            }, 'none', {});
            await Deno.writeTextFile(Deno.cwd() + '/cache/query_' + (index + 1) + 'of' + chunks.length + '_' + library + '.md', partialDoc);
            cleanChunks.push(partialDoc);
        }
        const result = cleanChunks.join('\n');
        await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, result);
        return result;
    }

    public async getDependencyDocumentation(libraryName: string, language: Language): Promise<string> {
        const query = `${libraryName} - ${language} documentation`;
        const searchResponse = await this.braveSearch(query);
        await this.logger?.log(`[Web Search] query: ${query}`);
        for (const [index, result] of searchResponse.web.results.entries()) {
            await this.logger?.log(`[Web Search] (#${index + 1}) ${result.title} - ${result.url}`);
        }


        const urls = await this.getURLsFromSearch(searchResponse, query);
        const pages: string[] = [];
        for (const url of urls) {
            await this.logger?.log(`[Scrape] ${url}`, true);
            const scrape = await this.scrapeWebsite({ url, formats: ['markdown'] });
            pages.push(scrape.data.markdown || '');
        }

        const documentation = await this.postProcessDocumentation(query, pages.join('\n'));

        return documentation;
    }

    private async braveSearch(query: string): Promise<BraveSearchResponse> {
        if (!BRAVE_API_KEY) {
            throw new Error('API key is required');
        }

        if (!query) {
            throw new Error('Search query is required');
        }

        const safeFilename = this.toSafeFilename('search_' + query, 'json');
        if (await exists(Deno.cwd() + '/cache/' + safeFilename)) {
            return JSON.parse(await Deno.readTextFile(Deno.cwd() + '/cache/' + safeFilename)) as BraveSearchResponse;
        }


        try {
            const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
                params: {
                    q: query
                },
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': BRAVE_API_KEY
                }
            });
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(`Brave Search API error: ${error.message}`);
            }
            throw error;
        }
    }

    private async pollCrawlStatus(statusUrl: string): Promise<CrawlResponse> {
        let retries = 0;

        while (true) {
            try {
                const response = await axios.get(statusUrl);
                const statusData: CrawlResponse = response.data;

                if (retries < 3 ||
                    (retries >= 3 && retries < 24 && (retries % 3 === 0)) ||
                    (retries >= 24 && (retries % 5 === 0))
                ) {
                    await this.logger?.log(`Polling status: ${statusData.status}, retry #${retries}`, true);
                }

                if (statusData.status === 'completed') {
                    return statusData;
                }

            } catch (error) {
                await this.logger?.log(`Polling error on retry #${retries}, continuing...`, true);
            }

            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    private toSafeFilename(filename: string, extension: 'json' | 'md'): string {
        return filename.replace(/[^a-zA-Z0-9]/g, '_').toLocaleLowerCase() + '.' + extension;
    }

    private async crawlWebsite(options: CrawlOptions): Promise<CrawlResponse> {
        if (!options.url) {
            throw new Error('URL is required');
        }

        const safeFilename = this.toSafeFilename('crawl_' + options.url, 'json');
        if (await exists(Deno.cwd() + '/cache/' + safeFilename)) {
            return JSON.parse(await Deno.readTextFile(Deno.cwd() + '/cache/' + safeFilename)) as CrawlResponse;
        }

        try {
            if (!FIRECRAWL_API_URL) {
                throw new Error('FIRECRAWL_API_URL is not set');
            }
            if (!options.url.match(/https?:\/\//)) {
                throw new Error(options.url + ' - URL must start with http:// or https://');
            } else {
                await this.logger?.log('Crawling ' + options.url, true);
            }
            const response = await axios.post(FIRECRAWL_API_URL + '/v1/crawl', {
                url: options.url,
                limit: options.limit || 100,
                scrapeOptions: {
                    formats: options.scrapeOptions?.formats || ['markdown']
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + FIRECRAWL_API_KEY
                }
            });

            const initResponse: CrawlInitResponse = response.data;
            const crawlResponse = await this.pollCrawlStatus(initResponse.url.replace('https://', 'http://'));
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(crawlResponse, null, 2));
            return crawlResponse;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(`Crawl API error: ${error.message}`);
            }
            throw error;
        }
    }

    private async mapWebsite(url: string): Promise<string[]> {
        if (!url) {
            throw new Error('URL is required');
        }

        const safeFilename = this.toSafeFilename('map_' + url, 'json');
        if (await exists(Deno.cwd() + '/cache/' + safeFilename)) {
            return JSON.parse(await Deno.readTextFile(Deno.cwd() + '/cache/' + safeFilename)).links;
        }

        try {
            if (!FIRECRAWL_API_URL) {
                throw new Error('FIRECRAWL_API_URL is not set');
            }
            if (!url.match(/https?:\/\//)) {
                throw new Error(url + ' - URL must start with http:// or https://');
            }

            const response = await axios.post(FIRECRAWL_API_URL + '/v1/map', {
                url: url
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + FIRECRAWL_API_KEY
                }
            });

            const mapResponse: MapResponse = response.data;
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(mapResponse, null, 2));
            return mapResponse.links;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(`Map API error: ${error.message}`);
            }
            throw error;
        }
    }

    private async scrapeWebsite(options: ScrapeOptions): Promise<ScrapeResponse> {
        if (!options.url) {
            throw new Error('URL is required');
        }

        const safeFilename = this.toSafeFilename('scrape_' + options.url, 'json');
        if (await exists(Deno.cwd() + '/cache/' + safeFilename)) {
            return JSON.parse(await Deno.readTextFile(Deno.cwd() + '/cache/' + safeFilename)) as ScrapeResponse;
        }

        try {
            if (!FIRECRAWL_API_URL) {
                throw new Error('FIRECRAWL_API_URL is not set');
            }
            if (!options.url.match(/https?:\/\//)) {
                throw new Error(options.url + ' - URL must start with http:// or https://');
            }

            const response = await axios.post(FIRECRAWL_API_URL + '/v1/scrape', {
                url: options.url,
                formats: options.formats || ['markdown']
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + FIRECRAWL_API_KEY
                }
            });

            const scrapeResponse: ScrapeResponse = response.data;
            if (scrapeResponse.data.metadata.statusCode > 399) {
                scrapeResponse.data.markdown = '';
                scrapeResponse.data.html = '';
                await this.logger?.log(`Scrape failed ${scrapeResponse.data.metadata.statusCode} - ${options.url}`, true);
            }
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(scrapeResponse, null, 2));

            return scrapeResponse;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(`Scrape API error: ${error.message}`);
            }
            throw error;
        }
    }
}
