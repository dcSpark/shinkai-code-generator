
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor as dbExecutor } from './shinkai-local-tools.ts';
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { city: string, max_price?: number, min_bedrooms?: number };
type OUTPUT = {};

interface RentalProperty {
    id: number;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { city, max_price, min_bedrooms } = inputs;

    // Fetch rental properties from a hypothetical API
    const response = await axios.get(`https://api.rentalproperties.com/search?city=${encodeURIComponent(city)}`);
    const properties: RentalProperty[] = response.data.properties;

    // Filter properties based on the input criteria
    const filteredProperties = properties.filter(property => 
        (!max_price || property.price <= max_price) &&
        (!min_bedrooms || property.bedrooms >= min_bedrooms)
    );

    // Prepare SQL statements for insertion
    const insertStatements = filteredProperties.map(property => `
        INSERT INTO rental_properties (id, title, address, price, bedrooms)
        VALUES (${property.id}, '${property.title}', '${property.address}', ${property.price}, ${property.bedrooms})
        ON CONFLICT(id) DO NOTHING;
    `).join(' ');

    // Execute SQL statements to store the results
    await dbExecutor(insertStatements);

    return {};
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"city":"San Francisco","max_price":3000,"min_bedrooms":2}')
  
  try {
    const program_result = await run({}, {"city":"San Francisco","max_price":3000,"min_bedrooms":2});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

