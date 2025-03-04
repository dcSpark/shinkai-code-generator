import "jsr:@std/dotenv/load";
import { BaseEngine, getDeepSeekR132B, getLlama318bInstruct, Payload } from "./llm-engines.ts";
import { getFullHeadersAndTools, tryToExtractJSON, tryToExtractMarkdown, tryToExtractPython, tryToExtractTS } from "./support.ts";
import { getTests, Test } from "./Test.ts";
import { Language } from "./types.ts";
import { TestFileManager } from "./TestFileManager.ts";
import { DependencyDoc } from "./DependencyDoc.ts";
import { ShinkaiAPI } from "./ShinkaiAPI.ts";

class ShinkaiPipeline {
    private language: Language;
    private test: Test;
    private llmModel: BaseEngine;
    private fileManager: TestFileManager;
    private step: number = 0;
    private feedback: string = '';
    private promptHistory: Payload | undefined;
    private docs: Record<string, string> = {};
    private internalToolsJSON: string[] = [];
    private code: string = '';
    private shinkaiPrompts: any;
    private availableTools: string[] = [];
    private startTime: number;

    constructor(language: Language, test: Test, llmModel: BaseEngine) {
        this.language = language;
        this.test = test;
        this.llmModel = llmModel;
        this.fileManager = new TestFileManager(language, test, llmModel);
        this.startTime = Date.now();
    }

    private async initialize() {
        const completeShinkaiPrompts = await getFullHeadersAndTools();
        this.shinkaiPrompts = completeShinkaiPrompts[this.language];
        this.availableTools = completeShinkaiPrompts.availableTools;
        await this.fileManager.log(`=========================================================`, true);
        await this.fileManager.log(`🔨 Running test #[${this.test.id}] ${this.test.code} @ ${this.language} w/ ${this.llmModel.name}`, true);
    }

    private async retryUntilSuccess<T>(fn: () => Promise<T>, expected: { regex?: RegExp[], isJSONArray?: boolean, isJSONObject?: boolean }): Promise<T> {
        let retries = 3;
        while (retries > 0) {
            try {
                const result: T = await fn();
                if (expected.regex) {
                    for (const r of expected.regex) {
                        if (!r.test(result as any as string)) {
                            console.log({ r, result })
                            throw new Error('Does not match format:' + String(r));
                        }
                    }
                    return result;
                }
                if (expected.isJSONArray) {
                    let json = JSON.parse(result as any as string);
                    if (Array.isArray(json)) {
                        return result;
                    }
                    throw new Error('Does not match format')
                }
                if (expected.isJSONObject) {
                    let json = JSON.parse(result as any as string);
                    if (typeof json === 'object') {
                        return result;
                    }
                    throw new Error('Does not match format')
                }
                return result
            } catch (e) {
                console.log(String(e));
                console.log('Stage failed...', retries);
                retries--;
            }
        }
        throw new Error('Failed to get result')
    }


    private async processRequirementsAndFeedback() {
        await this.retryUntilSuccess(async () => {
            this.fileManager.log(`[Step ${this.step}] System Requirements & Feedback Prompt`, true);
            const headers: string = (this.shinkaiPrompts.headers as any)['shinkai-local-tools'] || (this.shinkaiPrompts.headers as any)['shinkai_local_support'];
            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/requirements-feedback.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${this.test.prompt}\n\n</input_command>`
            )
                .replace(/\{LANGUAGE\}/g, this.language)
                .replace(/\{RUNTIME\}/g, this.language === 'typescript' ? 'Deno' : 'Python')
                .replace("<internal-libraries>\n\n</internal-libraries>", `<internal-libraries>\n${headers}\n</internal-libraries>`)
            await this.fileManager.save(this.step, 'a', prompt, 'requirements-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined);
            this.promptHistory = llmResponse.metadata;
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-requirements-response.md');
            this.feedback = tryToExtractMarkdown(llmResponse.message) || '';
            await this.fileManager.save(this.step, 'c', this.feedback, 'requirements.md');
            return this.feedback;
        }, {
            regex: [
                new RegExp("# Requirements"),
                new RegExp("# System Libraries"),
                new RegExp("# Internal Libraries"),
                new RegExp("# External Libraries"),
                new RegExp("# Example Inputs and Outputs"),
            ]
        })
        this.step++;
    }

    private async processUserFeedback() {
        await this.retryUntilSuccess(async () => {

            this.fileManager.log(`[Step ${this.step}] User Requirements & Feedback Prompt`, true);
            let user_feedback = '';
            if ((this.test as any).feedback) {
                user_feedback = (this.test as any).feedback;
            }
            if (this.language === 'typescript' && (this.test as any).feedback_ts) {
                user_feedback = (this.test as any).feedback_ts;
            } if (this.language === 'python' && (this.test as any).feedback_python) {
                user_feedback = (this.test as any).feedback_python;
            }
            if (!user_feedback) user_feedback = 'Ok';

            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/feedback.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${user_feedback}\n\n</input_command>`
            );
            await this.fileManager.save(this.step, 'a', prompt, 'feedback-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, this.promptHistory);
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-feedback-response.md');
            this.feedback = tryToExtractMarkdown(llmResponse.message) || '';
            await this.fileManager.save(this.step, 'c', this.feedback, 'feedback.md');
            return this.feedback;
        }, {
            regex: [
                new RegExp("# Requirements"),
                new RegExp("# System Libraries"),
                new RegExp("# Internal Libraries"),
                new RegExp("# External Libraries"),
                new RegExp("# Example Inputs and Outputs"),
            ]
        })
        this.step++;
    }

    private async processLibrarySearch() {
        const libraryJSON = await this.retryUntilSuccess(async () => {
            this.fileManager.log(`[Step ${this.step}] Library Search Prompt`, true);
            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/library.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${this.feedback}\n\n</input_command>`
            );
            await this.fileManager.save(this.step, 'a', prompt, 'library-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined);
            const promptResponse = llmResponse.message;
            await this.fileManager.save(this.step, 'b', promptResponse, 'raw-library-response.md');
            const libraryJSON = tryToExtractJSON(promptResponse) || '';
            await this.fileManager.save(this.step, 'c', libraryJSON || '', 'library.json');
            return libraryJSON;
        }, {
            isJSONArray: true
        });

        const libQueries = JSON.parse(libraryJSON) as string[];
        const codes = 'defghijklmnopqrstuvwxyz';
        for (const [index, library] of libQueries.entries()) {
            const dependencyDoc = await new DependencyDoc().getDependencyDocumentation(library, this.language, this.fileManager);
            this.docs[library] = dependencyDoc;
            await this.fileManager.save(this.step, codes[index % codes.length] as any, dependencyDoc, 'dependency-doc.md');
        }

        this.step++;
    }

    private async processInternalTools() {
        const libraryJSON = await this.retryUntilSuccess(async () => {
            this.fileManager.log(`[Step ${this.step}] Internal Libraries Prompt`, true);
            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/internal-tools.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${this.feedback}\n\n</input_command>`
            ).replace('<tool_router_key>\n\n</tool_router_key>', `<tool_router_key>\n${this.availableTools.join('\n')}\n</tool_router_key>`)
            await this.fileManager.save(this.step, 'a', prompt, 'internal-tools-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined);
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-internal-tools-response.md');
            const internalToolsJSONString = tryToExtractJSON(llmResponse.message) || '';
            await this.fileManager.save(this.step, 'c', internalToolsJSONString || '', 'internal-tools.json');
            return internalToolsJSONString;
        }, {
            isJSONArray: true
        });

        this.internalToolsJSON = JSON.parse(libraryJSON) as string[];
        this.step++;
    }

    private async generateCode() {
        this.fileManager.log(`[Step ${this.step}] Generate the tool code`, true);
        let toolPrompt = '';
        if (this.language === 'typescript') {
            toolPrompt = (await new ShinkaiAPI().getTypescriptToolImplementationPrompt(this.internalToolsJSON)).codePrompt;
        } else {
            toolPrompt = (await new ShinkaiAPI().getPythonToolImplementationPrompt(this.internalToolsJSON)).codePrompt;
        }

        const toolCode_1 = toolPrompt.replace(
            '<input_command>\n\n</input_command>',
            `<input_command>\n${this.feedback}\n\n</input_command>`
        );

        const toolCode = `
<libraries_documentation>
${Object.entries(this.docs).map(([library, doc]) => `
    <library_documentation=${library}>
    # ${library}
    ${doc}
    </library_documentation=${library}>
`).join('\n')}
</libraries_documentation>
        
        ` + toolCode_1;

        const llmResponse = await this.llmModel.run(toolCode, this.fileManager, undefined);
        const promptResponse = llmResponse.message;

        await this.fileManager.save(this.step, 'a', toolCode, 'code-prompt.md');
        await this.fileManager.save(this.step, 'b', promptResponse, 'raw-code-response.md');
        if (this.language === 'typescript') {
            const toolCodeTS = tryToExtractTS(promptResponse);
            await this.fileManager.save(this.step, 'c', toolCodeTS || '', 'tool.ts');
            this.code = toolCodeTS || '';
        } else {
            const toolCodePython = tryToExtractPython(promptResponse);
            await this.fileManager.save(this.step, 'c', toolCodePython || '', 'tool.py');
            this.code = toolCodePython || '';
        }
        this.step++;
    }

    private async generateMetadata() {
        this.fileManager.log(`[Step ${this.step}] Generate the metadata`, true);

        let metadataPrompt = '';
        if (this.language === 'typescript') {
            metadataPrompt = (await new ShinkaiAPI().getTypescriptToolImplementationPrompt(this.internalToolsJSON, this.code)).metadataPrompt;
        } else {
            metadataPrompt = (await new ShinkaiAPI().getPythonToolImplementationPrompt(this.internalToolsJSON, this.code)).metadataPrompt;
        }

        const llmResponse = await this.llmModel.run(metadataPrompt, this.fileManager, undefined);
        const promptResponse = llmResponse.message;
        await this.fileManager.save(this.step, 'a', metadataPrompt, 'metadata-prompt.md');
        await this.fileManager.save(this.step, 'b', promptResponse, 'raw-metadata-response.md');
        const metadataJSON = tryToExtractJSON(promptResponse);
        await this.fileManager.save(this.step, 'c', metadataJSON || '', 'metadata.json');
    }

    private async logCompletion() {
        const end = Date.now();
        const time = end - this.startTime;
        await this.fileManager.log(`[Done] took ${time}ms`, true);
        console.log('code available at', this.fileManager.toolDir);
    }

    public async run() {
        await this.initialize();
        await this.processRequirementsAndFeedback();
        await this.processUserFeedback();
        await this.processLibrarySearch();
        await this.processInternalTools();
        await this.generateCode();
        await this.generateMetadata();
        await this.logCompletion();
    }
}

async function start() {
    await TestFileManager.clearFolder();
    const llm = [
        getDeepSeekR132B(), // Good results (for testing outputs)
        // getLlama318bInstruct() // Fast results (for testing engine)
    ];
    for (const llmModel of llm) {
        for (const language of (['typescript', 'python']) as Language[]) {
            for (const test of getTests()) {
                const pipeline = new ShinkaiPipeline(language, test, llmModel);
                await pipeline.run();
            }
        }
    }
}

start();