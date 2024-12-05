import { shinkaiFoobar } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = {};
type OUTPUT = {
    message: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const response = await shinkaiFoobar("Hello foobar");
    return { message: response.message };
}