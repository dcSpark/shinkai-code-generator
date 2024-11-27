
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { company_name: string, days_back: number };
type NEWS_ITEM = {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
};
type OUTPUT = {
    news_count: number;
    recent_news: NEWS_ITEM[];
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { company_name, days_back } = inputs;
    const apiKey = 'YOUR_NEWS_API_KEY'; // Replace with a valid API key from a news provider
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days_back);

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(company_name)}&from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const articles: any[] = response.data.articles || [];
        const recent_news: NEWS_ITEM[] = articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt
        }));

        return {
            news_count: recent_news.length,
            recent_news
        };
    } catch (error) {
        console.error('Error fetching news:', error);
        return {
            news_count: 0,
            recent_news: []
        };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"company_name":"Tesla","days_back":30}')
  
  try {
    const program_result = await run({}, {"company_name":"Tesla","days_back":30});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

