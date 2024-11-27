```typescript
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
```