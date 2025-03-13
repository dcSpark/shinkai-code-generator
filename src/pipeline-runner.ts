import "jsr:@std/dotenv/load";
import { getOpenAIO4Mini } from "./llm-engines.ts";
import { ShinkaiPipeline } from "./ShinkaiPipeline.ts";
import { Test } from "./Test.ts";
import { Language } from "./types.ts";

// Parse command line arguments in the format key=value
const args = Deno.args;
const argMap: Record<string, string> = {};

args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key && value !== undefined) {
        argMap[key] = value;
    }
});
const delimiter = `"#|#"`

const language = argMap['language'] as Language;
const requestUUID = argMap['request-uuid'];
let prompt = argMap['prompt'] || '';
prompt = prompt.replaceAll(delimiter, '');
// prompt = prompt.match(/^#|#(.*)#|#$/)?.[1] || '';
let feedback = argMap['feedback'] || ''; // Default to empty string if not provided
feedback = feedback.replaceAll(delimiter, '')
// feedback = feedback.match(/^#|#(.*)#|#$/)?.[1] || '';

if (!language || !requestUUID || !prompt) {
    console.log(JSON.stringify({ language, requestUUID, prompt, feedback }));
    console.log("Usage: deno run pipeline-runner.ts language=<language> request-uuid=<request-uuid> prompt=<prompt> feedback=<feedback>");
    Deno.exit(1);
}

// Run the pipeline and stream output
const runPipeline = async () => {
    try {
        const codeTest: Test = new Test({
            code: requestUUID,
            prompt: prompt,
            feedback: feedback,
            prompt_type: '',
            tools: [],
            inputs: {},
            config: {},
        });

        const llmModel = getOpenAIO4Mini();

        console.log('EVENT: start');
        Deno.env.set('FORCE_DOCS_GENERATION', 'true');
        const pipeline = new ShinkaiPipeline(language, codeTest, llmModel, true);

        // Add event listeners to the pipeline if ShinkaiPipeline supports them
        // If not, you might need to modify ShinkaiPipeline to emit progress events

        await pipeline.run();

        // console.log('EVENT: complete');

    } catch (error: unknown) {
        console.error(`EVENT: error\n${(error as Error).message}`);
    }
};

// Execute the pipeline
runPipeline(); 