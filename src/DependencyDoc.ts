import axios, { AxiosError } from 'npm:axios';
import { TestFileManager } from "./TestFileManager.ts";
import { exists } from "jsr:@std/fs/exists";
import { Language } from "./types.ts";
import { BaseEngine } from './llm-engines.ts';
const BRAVE_API_KEY = Deno.env.get('BRAVE_API_KEY');
const FIRECRAWL_API_URL = Deno.env.get('FIRECRAWL_API_URL');

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
    formats?: 'markdown' | 'html'[];
}

export class DependencyDoc {
    // constructor(private llm: BaseEngine) { }

    public async getDependencyDocumentation(query: string, language: Language, logger: TestFileManager | undefined = undefined): Promise<string> {
        const query_ = `${query} - ${language} documentation`;
        const searchResponse = await this.braveSearch(query_);
        await logger?.log(`[Web Search] query: ${query_}`);
        for (const [index, result] of searchResponse.web.results.entries()) {
            await logger?.log(`[Web Search] (#${index + 1}) ${result.title} - ${result.url}`);
        }

        // How to get the best match? trust the first result?
        const url = searchResponse.web.results.find(r => {
            const isCompressedFile = r.url.match(/\.(zip|tar|gz|bz2|rar|7z|iso)$/);
            const isBinaryFile = r.url.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|dmg|pkg|deb|rpm|msi|exe|app|exe|app|pkg|rpm|deb|msi)$/);
            if (isCompressedFile || isBinaryFile) {
                console.log('Skipping', r.url);
            }
            return !isCompressedFile && !isBinaryFile;
        })?.url;
        if (!url) {
            throw new Error('No URL found');
        }

        //         await this.llm.run(`
        // In the search results tag, there is JSON with a internet serach result for ${query_}
        // <search_results>
        // ${JSON.stringify(searchResponse.web.results.map(r => ({
        //             title: r.title,
        //             url: r.url,
        //             description: r.description,
        //         })))}
        // </search_results>

        // <rules>
        // * We want to get the links that 

        //             `, logger, undefined);


        await logger?.log(`[Crawl] ${url}`);
        const crawl = await this.crawlWebsite({ url });
        return crawl.data.map(d => d.markdown).join('\n');
    }

    private async braveSearch(query: string): Promise<BraveSearchResponse> {
        if (!BRAVE_API_KEY) {
            throw new Error('API key is required');
        }

        if (!query) {
            throw new Error('Search query is required');
        }

        const safeFilename = this.toSafeFilename('search_' + query);
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
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(response.data));
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
                    console.log(`Polling status: ${statusData.status}, retry #${retries}`);
                }

                if (statusData.status === 'completed') {
                    return statusData;
                }

            } catch (error) {
                console.log(`Polling error on retry #${retries}, continuing...`);
            }

            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    private toSafeFilename(filename: string): string {
        return filename.replace(/[^a-zA-Z0-9]/g, '_');
    }

    private async crawlWebsite(options: CrawlOptions): Promise<CrawlResponse> {
        if (!options.url) {
            throw new Error('URL is required');
        }

        const safeFilename = this.toSafeFilename(options.url);
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
                console.log('Crawling ' + options.url);
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
                }
            });

            const initResponse: CrawlInitResponse = response.data;
            const crawlResponse = await this.pollCrawlStatus(initResponse.url.replace('https://', 'http://'));
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(crawlResponse));
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

        const safeFilename = this.toSafeFilename('map_' + url);
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
                }
            });

            const mapResponse: MapResponse = response.data;
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(mapResponse));
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

        const safeFilename = this.toSafeFilename('scrape_' + options.url);
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
                }
            });

            const scrapeResponse: ScrapeResponse = response.data;
            await Deno.writeTextFile(Deno.cwd() + '/cache/' + safeFilename, JSON.stringify(scrapeResponse));
            return scrapeResponse;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(`Scrape API error: ${error.message}`);
            }
            throw error;
        }
    }
}
