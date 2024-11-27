```typescript
import { shinkaiDownloadPages, shinkaiLlmPromptProcessor } from './shinkai-local-tools.ts'

type CONFIG = {};
type INPUTS = { urls: string[] };
type OUTPUT = { summaries: string[] };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { markdowns } = await shinkaiDownloadPages(inputs.urls);
    const summaries = await Promise.all(markdowns.map(async (markdown) => {
        const prompt = `Summarize the following content in 100 characters:\n\n${markdown}`;
        const result = await shinkaiLlmPromptProcessor('text', prompt);
        return result.message.trim();
    }));
    return { summaries };
}
```