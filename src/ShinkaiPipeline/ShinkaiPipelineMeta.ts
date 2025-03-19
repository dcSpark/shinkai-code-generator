
import { FileManager } from "./FileManager.ts";
import { BaseEngine } from "./llm-engines.ts";
import { LLMFormatter } from "./LLMFormatter.ts";
import { Requirement } from "./Requirement.ts";
import { Language } from "./types.ts";

export class ShinkaiPipelineMetadata {
    // Setup in constructor
    private fileManager: FileManager;
    private llmFormatter: LLMFormatter;

    // State machine step
    private step: number = 0;

    // Internal tools
    private internalToolsJSON: string[] = [];

    // Generated code
    private metadata: string = '';

    // Start time
    private startTime: number;


    constructor(
        private code: string,
        private language: Language,
        private test: Requirement,
        private llmModel: BaseEngine,
        private stream: boolean,
    ) {
        this.fileManager = new FileManager(language, test.code, stream);
        this.llmFormatter = new LLMFormatter(this.fileManager);
        this.startTime = Date.now();
    }

    private async generateMetadata() {
        // Check if output file exists
        if (await this.fileManager.exists(this.step, 'c', 'metadata.json')) {
            await this.fileManager.log(` Step ${this.step} - Metadata `, true);
            const m = await this.fileManager.load(this.step, 'c', 'metadata.json');
            this.metadata = m;
            this.step++;
            return;
        }

        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
            this.fileManager.log(`[Planning Step ${this.step}] Generate the metadata`, true);

            let metadataPrompt = Deno.readTextFileSync(Deno.cwd() + '/prompts/metadata-prompt.md');
            metadataPrompt = metadataPrompt.replace(
                /<available_tools>\n\n<\/available_tools>/,
                `<available_tools>${this.internalToolsJSON.join('\n')}</available_tools>`
            );
            metadataPrompt = metadataPrompt.replace(
                /<code>\n\n<\/code>/,
                `<code>${this.code}</code>`
            );

            const llmResponse = await this.llmModel.run(metadataPrompt, this.fileManager, undefined, "Generating Tool Metadata");
            const promptResponse = llmResponse.message;
            await this.fileManager.save(this.step, 'a', metadataPrompt, 'metadata-prompt.md');
            await this.fileManager.save(this.step, 'b', promptResponse, 'raw-metadata-response.md');
            return promptResponse;
        }, 'json', {
            regex: [
                new RegExp("name"),
                new RegExp("configurations"),
                new RegExp("parameters"),
                new RegExp("result"),
            ]
        });
        this.metadata = parsedLLMResponse;
        await this.fileManager.save(this.step, 'c', this.metadata, 'metadata.json');
        this.step++;
    }

    public async run() {
        try {
            await this.generateMetadata();
            return { metadata: this.metadata }
        } catch (e) {
            console.log(String(e));
            return {
                status: "ERROR",
                code: '',
                metadata: '',
            }

        }
    }
}