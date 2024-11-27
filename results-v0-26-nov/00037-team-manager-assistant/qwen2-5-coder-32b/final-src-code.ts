
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { team_size: number, project_type: string, management_style: string };
type OUTPUT = { inspirational_quotes: string[], recommended_activities: string[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { team_size, project_type, management_style } = inputs;

    // Fetch inspirational quotes based on the provided parameters
    const inspirationalQuotes = await fetchInspirationalQuotes(management_style);

    // Generate recommended activities based on team size and project type
    const recommendedActivities = generateRecommendedActivities(team_size, project_type);

    return {
        inspirational_quotes: inspirationalQuotes,
        recommended_activities: recommendedActivities
    };
}

async function fetchInspirationalQuotes(style: string): Promise<string[]> {
    // This is a placeholder for fetching quotes. In a real scenario, this would query a database or an API.
    const quotes = [
        "The best way to predict the future is to invent it. - Alan Kay",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "It does not matter how slowly you go as long as you do not stop. - Confucius"
    ];

    // Filter quotes based on management style
    return quotes.filter(quote => quote.toLowerCase().includes(style.toLowerCase()));
}

function generateRecommendedActivities(size: number, type: string): string[] {
    const activities = [];

    if (size <= 5) {
        activities.push("Daily stand-ups");
        activities.push("Pair programming sessions");
    } else {
        activities.push("Weekly team lunches");
        activities.push("Monthly off-site retreats");
    }

    switch (type.toLowerCase()) {
        case "software development":
            activities.push("Code reviews");
            activities.push("Technical workshops");
            break;
        case "product management":
            activities.push("Customer feedback sessions");
            activities.push("Product vision alignment meetings");
            break;
        default:
            activities.push("Creative brainstorming sessions");
            activities.push("Team-building exercises");
    }

    return activities;
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"team_size":5,"project_type":"software development","management_style":"agile"}')
  
  try {
    const program_result = await run({}, {"team_size":5,"project_type":"software development","management_style":"agile"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

