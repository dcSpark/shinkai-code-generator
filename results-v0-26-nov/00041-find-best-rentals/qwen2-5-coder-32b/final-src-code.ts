
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { city: string, criteria: Array<{ factor: string, weight: number }> };
type OUTPUT = Array<{ propertyId: number, score: number }>;

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { city, criteria } = inputs;

    // Fetch properties from the database for the given city
    const properties = await localRustToolkitShinkaiSqliteQueryExecutor(`SELECT * FROM properties WHERE city = ?`, [city]);

    // Calculate score for each property based on criteria
    const scoredProperties = properties.map(property => {
        let score = 0;
        criteria.forEach(({ factor, weight }) => {
            const propertyValue = (property as any)[factor];
            if (typeof propertyValue === 'number') {
                score += propertyValue * weight;
            }
        });
        return { propertyId: property.id, score };
    });

    // Sort properties by score in descending order
    scoredProperties.sort((a, b) => b.score - a.score);

    return scoredProperties;
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"city":"Austin","criteria":[{"factor":"price","weight":0.4},{"factor":"location","weight":0.3},{"factor":"amenities","weight":0.3}]}')
  
  try {
    const program_result = await run({}, {"city":"Austin","criteria":[{"factor":"price","weight":0.4},{"factor":"location","weight":0.3},{"factor":"amenities","weight":0.3}]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

