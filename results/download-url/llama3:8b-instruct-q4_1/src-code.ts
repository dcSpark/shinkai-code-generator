import { shinkaiDownloadPages } from '@shinkai/local-tools';
import { shinkaiSqliteQueryExecutor } from '@shinkai/local-tools';

type CONFIG = {};
type INPUTS = {
  urls: string[];
};
type OUTPUT = {};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const sqliteDb = await shinkaiSqliteQueryExecutor('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL)');
  for (const url of inputs.urls) {
    const html = await shinkaiDownloadPages(url);
    const plainText = await shinkaiDownloadPages(url, { download: false });
    await shinkaiSqliteQueryExecutor(`INSERT INTO urls (url, content) VALUES (?, ?)`, [url, plainText]);
  }
  return {};
}