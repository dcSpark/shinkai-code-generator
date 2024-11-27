
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { destination: string, duration_days: number, budget?: number };
type OUTPUT = { itinerary: Array<{ day: number, activities: Array<string> }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { destination, duration_days, budget } = inputs;

    // Simulate fetching data from a local SQLite database for demonstration purposes
    const activitiesQuery = `SELECT activity FROM travel_activities WHERE location LIKE '%${destination}%'`;
    const activitiesData = await localRustToolkitShinkaiSqliteQueryExecutor(activitiesQuery);
    const activities = activitiesData.map((row: any) => row.activity);

    // Simple algorithm to distribute activities over the duration of the trip
    const itinerary = [];
    let day = 1;
    while (day <= duration_days) {
        const dailyActivities = [];
        for (let i = 0; i < Math.min(3, activities.length); i++) { // Assuming max 3 activities per day
            const randomIndex = Math.floor(Math.random() * activities.length);
            dailyActivities.push(activities[randomIndex]);
            activities.splice(randomIndex, 1); // Remove the activity to avoid repetition
        }
        itinerary.push({ day: day++, activities: dailyActivities });
    }

    return { itinerary };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"destination":"Tokyo, Japan","duration_days":7,"budget":2000}')
  
  try {
    const program_result = await run({}, {"destination":"Tokyo, Japan","duration_days":7,"budget":2000});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

