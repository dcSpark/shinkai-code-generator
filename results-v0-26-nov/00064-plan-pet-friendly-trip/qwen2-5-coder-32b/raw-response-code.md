```typescript
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
```