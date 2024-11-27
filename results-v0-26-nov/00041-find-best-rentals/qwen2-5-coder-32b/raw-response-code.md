```typescript
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
```