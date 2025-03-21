import { SearchResponse } from "../Search.ts";

export const selectSearchUrlsPrompt = (searchResponse: SearchResponse, finalQuery: string) => `
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

            `