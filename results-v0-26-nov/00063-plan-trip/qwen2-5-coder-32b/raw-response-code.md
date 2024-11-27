```typescript
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
```