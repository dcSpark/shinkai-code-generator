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