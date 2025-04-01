import { ServiceAPIBase } from "./service-api-base.ts";


const prompt = ` 
For Jupiter DEX create a tool that retrieves detailed token information by address or symbol.

Requirements: 
- Support lookup by both mint address and symbol
- Return comprehensive token metadata
- Handle non-existent token errors
- Include token statistics if available

JUPITER_API_URL: https://api.jup.ag

For testing use ETH (wrapped) address: 7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs
`;

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest(prompt, 'typescript', 'jupiter', true);