import { ServiceAPIBase } from './service-api-base.ts';


const prompt = `Create a Typescript tool that interacts with the CoinGecko API to fetch cryptocurrency market data.

Requirements:
- Support both free and pro API endpoints
- Accept configuration parameters including an optional API key
- Accept input parameters for:
  - Pagination (page, page_size)
  - Sorting options (by market cap, volume, or ID in ascending or descending order)
  - Filtering by volume and market cap ranges
  - Currency denomination (USD, EUR, BTC, etc.)
- Implement robust error handling with retry logic using the tenacity library
- Handle rate limiting appropriately
- Include fallback mock data for testing purposes

The tool should return a structured output containing:
- Formatted coin data (including ID, symbol, name, current price, market cap, volume, and 24-hour price change)
- Pagination details (current page, total pages, total items)

Ensure the implementation follows type hints, includes proper API status checking, and formats the response data consistently.`;

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest(prompt, 'typescript', 'coingecko', true);
