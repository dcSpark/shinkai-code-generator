
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { website_url: string, competitor_urls?: string[] };
type OUTPUT = {
    seoInsights: {
        titleAnalysis: string,
        metaDescriptionAnalysis: string,
        keywordDensity: string,
        mobileFriendliness: string,
        backlinkCount: number
    },
    recommendations: string[]
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { website_url, competitor_urls } = inputs;

    // Helper function to fetch HTML content of a URL
    const fetchHTMLContent = async (url: string) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            return '';
        }
    };

    // Helper function to analyze title
    const analyzeTitle = (htmlContent: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const titleElement = doc.querySelector('title');
        const titleText = titleElement ? titleElement.textContent : '';
        if (!titleText || titleText.length < 10 || titleText.length > 60) {
            return `Title is too short or too long. Current length: ${titleText.length}.`;
        }
        return 'Title is appropriate in length.';
    };

    // Helper function to analyze meta description
    const analyzeMetaDescription = (htmlContent: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const metaDescriptionElement = doc.querySelector('meta[name="description"]');
        const metaDescriptionText = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : '';
        if (!metaDescriptionText || metaDescriptionText.length < 50 || metaDescriptionText.length > 160) {
            return `Meta description is too short or too long. Current length: ${metaDescriptionText.length}.`;
        }
        return 'Meta description is appropriate in length.';
    };

    // Helper function to check mobile-friendliness
    const checkMobileFriendliness = async (url: string) => {
        try {
            const response = await axios.get(`https://search.google.com/search-console/v1/urlTestingTools/mobileFriendlyTest/run?key=YOUR_API_KEY`, {
                params: { url }
            });
            return response.data.mobileFriendliness === 'MOBILE_FRIENDLY' ? 'Website is mobile-friendly.' : 'Website is not mobile-friendly.';
        } catch (error) {
            console.error(`Failed to check mobile-friendliness for ${url}:`, error);
            return 'Could not determine mobile-friendliness due to an error.';
        }
    };

    // Helper function to estimate backlink count
    const estimateBacklinkCount = async (url: string) => {
        try {
            const response = await axios.get(`https://api.majestic.com/api/json?app_api_key=YOUR_API_KEY&cmd=getBackLinkData&items=10&datasource=fresh&url=${encodeURIComponent(url)}`);
            return response.data.data[0].ExtBackLinks;
        } catch (error) {
            console.error(`Failed to estimate backlink count for ${url}:`, error);
            return 0;
        }
    };

    const mainWebsiteContent = await fetchHTMLContent(website_url);

    const seoInsights = {
        titleAnalysis: analyzeTitle(mainWebsiteContent),
        metaDescriptionAnalysis: analyzeMetaDescription(mainWebsiteContent),
        keywordDensity: 'Keyword density analysis requires specific keywords and is not implemented here.',
        mobileFriendliness: await checkMobileFriendliness(website_url),
        backlinkCount: await estimateBacklinkCount(website_url)
    };

    const recommendations = [];
    if (seoInsights.titleAnalysis !== 'Title is appropriate in length.') {
        recommendations.push('Optimize the title tag for better SEO.');
    }
    if (seoInsights.metaDescriptionAnalysis !== 'Meta description is appropriate in length.') {
        recommendations.push('Optimize the meta description for better SEO.');
    }
    if (seoInsights.mobileFriendliness === 'Website is not mobile-friendly.') {
        recommendations.push('Make the website mobile-friendly to improve user experience and rankings.');
    }
    if (seoInsights.backlinkCount < 10) {
        recommendations.push('Work on building more backlinks from reputable sites.');
    }

    return { seoInsights, recommendations };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"website_url":"example.com","competitor_urls":["competitor1.com","competitor2.com"]}')
  
  try {
    const program_result = await run({}, {"website_url":"example.com","competitor_urls":["competitor1.com","competitor2.com"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

