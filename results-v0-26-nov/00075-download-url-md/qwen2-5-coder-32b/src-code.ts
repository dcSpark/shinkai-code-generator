import { shinkaiDownloadPages } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { urls: string[] };
type OUTPUT = { markdowns: string[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const result = await shinkaiDownloadPages(inputs.urls);
    return result;
}