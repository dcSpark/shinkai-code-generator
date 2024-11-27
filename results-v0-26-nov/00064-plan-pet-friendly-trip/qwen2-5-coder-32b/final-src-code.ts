
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import localRustToolkitShinkaiSqliteQueryExecutor from 'npm:local-rust-toolkit-shinkai-sqlite-query-executor@1.0.0';

type CONFIG = {};
type INPUTS = { destination: string, duration_days: number, pet_type: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { destination, duration_days, pet_type } = inputs;

    // Simulate itinerary generation logic
    const itinerary = generatePetFriendlyItinerary(destination, duration_days, pet_type);

    if (!itinerary) {
        return { success: false, message: "Failed to generate itinerary." };
    }

    // Store the result in SQL
    const query = `
        INSERT INTO pet_friendly_itineraries (destination, duration_days, pet_type, details)
        VALUES (?, ?, ?, ?);
    `;

    try {
        await localRustToolkitShinkaiSqliteQueryExecutor(query, [destination, duration_days, pet_type, JSON.stringify(itinerary)]);
        return { success: true, message: "Itinerary stored successfully." };
    } catch (error) {
        return { success: false, message: `Error storing itinerary: ${error}` };
    }
}

function generatePetFriendlyItinerary(destination: string, duration_days: number, pet_type: string): any | null {
    // This is a placeholder for actual itinerary generation logic
    if (!destination || !duration_days || !pet_type) return null;

    const activities = [
        { day: 1, activity: `Visit the local ${petTypeToActivity(pet_type)} park.` },
        { day: duration_days, activity: "Enjoy a picnic at sunset." }
    ];

    for (let i = 2; i < duration_days; i++) {
        activities.push({ day: i, activity: "Explore pet-friendly attractions in the city." });
    }

    return {
        destination,
        duration_days,
        pet_type,
        activities
    };
}

function petTypeToActivity(pet_type: string): string {
    switch (pet_type.toLowerCase()) {
        case 'dog':
            return "dog";
        case 'cat':
            return "cat";
        default:
            return "general";
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"destination":"Portland, Oregon","duration_days":5,"pet_type":"dog"}')
  
  try {
    const program_result = await run({}, {"destination":"Portland, Oregon","duration_days":5,"pet_type":"dog"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

