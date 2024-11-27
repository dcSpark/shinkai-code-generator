
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { destination: string, duration_days: number, max_budget: number };
type OUTPUT = { itinerary: Array<{ day: number, activities: Array<string>, cost: number }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { destination, duration_days, max_budget } = inputs;

    // Simulate fetching budget-friendly activities from a local database
    const activitiesQuery = `SELECT name, cost FROM activities WHERE destination = '${destination}' AND cost <= ${max_budget / duration_days} ORDER BY cost ASC`;
    const availableActivities: Array<{ name: string, cost: number }> = await localRustToolkitShinkaiSqliteQueryExecutor(activitiesQuery);

    let remainingBudget = max_budget;
    const itinerary: Array<{ day: number, activities: Array<string>, cost: number }> = [];

    for (let day = 1; day <= duration_days; day++) {
        let dailyCost = 0;
        const dailyActivities: string[] = [];

        for (const activity of availableActivities) {
            if (remainingBudget - dailyCost >= activity.cost) {
                dailyActivities.push(activity.name);
                dailyCost += activity.cost;
            }
        }

        itinerary.push({ day, activities: dailyActivities, cost: dailyCost });
        remainingBudget -= dailyCost;
    }

    return { itinerary };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"destination":"Bangkok, Thailand","duration_days":10,"max_budget":500}')
  
  try {
    const program_result = await run({}, {"destination":"Bangkok, Thailand","duration_days":10,"max_budget":500});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

