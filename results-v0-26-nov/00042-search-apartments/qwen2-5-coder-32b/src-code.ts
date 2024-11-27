import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { location: string, price_range: [number, number], requirements: string[] };
type OUTPUT = { apartments: any[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { location, price_range, requirements } = inputs;
    const [minPrice, maxPrice] = price_range;

    /* Constructing the SQL query to search for apartments based on given criteria */
    let query = `SELECT * FROM apartments WHERE location = ? AND price BETWEEN ? AND ?`;
    let params: any[] = [location, minPrice, maxPrice];

    requirements.forEach((requirement, index) => {
        query += ` AND requirements LIKE ?`;
        params.push(`%${requirement}%`);
    });

    const result = await localRustToolkitShinkaiSqliteQueryExecutor(query, params);
    return { apartments: result };
}