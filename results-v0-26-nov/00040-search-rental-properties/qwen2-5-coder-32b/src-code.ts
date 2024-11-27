import { localRustToolkitShinkaiSqliteQueryExecutor as dbExecutor } from './shinkai-local-tools.ts';
import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { city: string, max_price?: number, min_bedrooms?: number };
type OUTPUT = {};

interface RentalProperty {
    id: number;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { city, max_price, min_bedrooms } = inputs;

    // Fetch rental properties from a hypothetical API
    const response = await axios.get(`https://api.rentalproperties.com/search?city=${encodeURIComponent(city)}`);
    const properties: RentalProperty[] = response.data.properties;

    // Filter properties based on the input criteria
    const filteredProperties = properties.filter(property => 
        (!max_price || property.price <= max_price) &&
        (!min_bedrooms || property.bedrooms >= min_bedrooms)
    );

    // Prepare SQL statements for insertion
    const insertStatements = filteredProperties.map(property => `
        INSERT INTO rental_properties (id, title, address, price, bedrooms)
        VALUES (${property.id}, '${property.title}', '${property.address}', ${property.price}, ${property.bedrooms})
        ON CONFLICT(id) DO NOTHING;
    `).join(' ');

    // Execute SQL statements to store the results
    await dbExecutor(insertStatements);

    return {};
}