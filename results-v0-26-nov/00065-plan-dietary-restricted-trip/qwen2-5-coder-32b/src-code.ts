import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { destination: string, duration_days: number, dietary_restrictions: string[] };
type OUTPUT = { itinerary: { day: number, meals: { mealType: string, restaurantName: string, address: string }[] }[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { destination, duration_days, dietary_restrictions } = inputs;

    // Fetch restaurants based on dietary restrictions and location
    const query = `
        SELECT name, address, meal_type 
        FROM restaurants 
        WHERE location = ? AND (dietary_tags LIKE ? OR dietary_tags LIKE ?)
    `;
    const params = [destination, `%${dietary_restrictions[0]}%`, `%${dietary_restrictions[1] || ''}%`]; // Extend for more restrictions if needed
    const results = await localRustToolkitShinkaiSqliteQueryExecutor(query, params);

    // Organize meals into an itinerary
    const restaurantsByMealType = results.reduce((acc, restaurant) => {
        acc[restaurant.meal_type] = [...(acc[restaurant.meal_type] || []), restaurant];
        return acc;
    }, {} as { [key: string]: any[] });

    const days = Array.from({ length: duration_days }, (_, i) => ({
        day: i + 1,
        meals: [
            { mealType: 'breakfast', restaurantName: restaurantsByMealType['breakfast']?.[i % restaurantsByMealType['breakfast'].length]?.name || 'No available option' },
            { mealType: 'lunch', restaurantName: restaurantsByMealType['lunch']?.[i % restaurantsByMealType['lunch'].length]?.name || 'No available option' },
            { mealType: 'dinner', restaurantName: restaurantsByMealType['dinner']?.[i % restaurantsByMealType['dinner'].length]?.name || 'No available option' }
        ]
    }));

    return { itinerary: days };
}