import { parseArgs } from "jsr:@std/cli/parse-args";
import "jsr:@std/dotenv/load";
import { getOpenAIO4Mini } from "./llm-engines.ts";
import { ShinkaiPipeline } from "./ShinkaiPipeline.ts";
import { getTests } from "./Test.ts";
import { TestFileManager } from "./TestFileManager.ts";
import { Language } from "./types.ts";

const flags = parseArgs(Deno.args, {
    boolean: ["keepcache", "force-docs"],
});
const KEEP_CACHE = flags.keepcache || flags["force-docs"];
const FORCE_DOCS_GENERATION = flags["force-docs"];

async function start() {
    if (!KEEP_CACHE) {
        await TestFileManager.clearFolder();
    }
    const llm = [
        // getDeepSeekR132B(), // Good results (for testing outputs)
        // getLlama318bInstruct() // Fast results (for testing engine)
        getOpenAIO4Mini() // Fast + Good
    ];
    const languages: Language[] = [
        'typescript',
        'python'
    ];
    for (const llmModel of llm) {
        for (const language of languages) {
            for (const test of getTests()) {
                const pipeline = new ShinkaiPipeline(language, test, llmModel, true);
                await pipeline.run();
            }
        }
    }
}


start();