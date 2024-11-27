import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { calendar_id: string, days_ahead: number };
type OUTPUT = { upcoming_birthdays: Array<{ name: string, date: string }> };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { calendar_id, days_ahead } = inputs;

    // Fetching birthdays from the SQLite database
    const query = `
        SELECT name, date 
        FROM birthdays 
        WHERE calendar_id = ? AND 
              julianday(date) BETWEEN julianday('now') AND julianday('now', '+' || ? || ' days');
    `;
    const results = await localRustToolkitShinkaiSqliteQueryExecutor(query, [calendar_id, days_ahead]);

    return { upcoming_birthdays: results };
}