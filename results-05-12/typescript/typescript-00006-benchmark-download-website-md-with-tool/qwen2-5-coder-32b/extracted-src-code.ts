import { shinkaiDownloadPages } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { urls: string[] };
type OUTPUT = { content: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { markdowns } = await shinkaiDownloadPages(inputs.urls);
    return { content: markdowns.join('\n') };
}