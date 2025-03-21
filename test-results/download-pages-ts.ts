import { downloadPages } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { markdown: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { url } = inputs;
    const { markdown } = await downloadPages({ url });
    return { markdown };
}