import { ServiceAPIBase } from "./service-api-base.ts";


const prompt = `
Create a tool that retrieves detailed token information by address or symbol.

Requirements:
- Support lookup by both mint address and symbol
- Return comprehensive token metadata
- Handle non-existent token errors
- Include token statistics if available

For documentation: https://station.jup.ag/docs/api/token-api/token-information 
`;

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest(prompt, 'typescript', 'jupiter', true);