
export class PromptGenerator {
    constructor(
        private readonly filePath: string,
        private readonly replacements: [(string | RegExp), string][] = []
    ) {
    }

    async generatePrompt(showErrors: boolean = true): Promise<string> {
        let prompt = (await Deno.readTextFile(this.filePath));
        if (!prompt) {
            throw new Error(`Prompt file ${this.filePath} not found`);
        }
        for (const [search, _] of this.replacements) {
            if (!prompt.match(search)) {
                console.log('PARTIAL PROMPT', prompt);
                throw new Error(`Replacement ${search} not found in ${this.filePath}`);
            }
        }
        for (const [search, replace] of this.replacements) {
            prompt = prompt.replace(search, replace);
        }
        const matches = prompt.match(/\{[A-Z_]+\}/g);
        if (matches && showErrors) {
            console.log('PARTIAL PROMPT', prompt);
            throw new Error(`Prompt contains placeholder ${matches[0]}`);
        }

        return prompt;
    }

    postProcessPrompt(prompt: string, replacements: [(string | RegExp), string][]): string {
        const matches = prompt.match(/\{[A-Z_]+\}/g);
        if (matches) {
            console.log('PARTIAL PROMPT', prompt);
            throw new Error(`Prompt contains placeholder ${matches[0]}`);
        }
        for (const [search, replace] of replacements) {
            prompt = prompt.replace(search, replace);
        }
        return prompt;
    }
}
