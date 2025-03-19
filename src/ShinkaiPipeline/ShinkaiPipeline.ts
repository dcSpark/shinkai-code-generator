import { parseArgs } from "jsr:@std/cli/parse-args";
import "jsr:@std/dotenv/load";
import path from "node:path";
import { DependencyDoc } from "../DocumentationGenrator/DependencyDoc.ts";
import { FileManager } from "./FileManager.ts";
import { BaseEngine, Payload } from "./llm-engines.ts";
import { LLMFormatter } from "./LLMFormatter.ts";
import { Requirement } from "./Requirement.ts";
import { CheckCodeResponse, ShinkaiAPI } from "./ShinkaiAPI.ts";
import { ShinkaiPipelineMetadata } from "./ShinkaiPipelineMeta.ts";
import { getFullHeadersAndTools, getInternalTools } from "./support.ts";
import { Language } from "./types.ts";

const flags = parseArgs(Deno.args, {
    boolean: ["keepcache", "force-docs"],
});
const KEEP_CACHE = flags.keepcache || flags["force-docs"];
const FORCE_DOCS_GENERATION = flags["force-docs"];

export class ShinkaiPipeline {
    // Setup in constructor
    private fileManager: FileManager;
    private llmFormatter: LLMFormatter;

    // State machine step
    private step: number = 0;

    // Final "Requirements" with feedback
    private feedback: string = '';

    // Used to pass the prompt history from requirements to feedback
    private promptHistory: Payload | undefined;

    // Feedback analysis result
    private feedbackAnalysisResult: string = '';

    // External libraries docs
    private docs: Record<string, string> = {};

    // Internal tools
    private internalToolsJSON: string[] = [];

    // Generated plan
    private plan: string = '';

    // Generated code
    private code: string = '';
    private metadata: string = '';

    // Start time
    private startTime: number;

    // Tool type
    private toolType: 'shinkai' | 'mcp';

    private shinkaiLocalTools_headers: string = '';
    private shinkaiLocalTools_libraryCode: string = '';
    private shinkaiLocalTools_toolRouterKeys: { functionName: string, toolRouterKey: string, code: string }[] = [];
    private shinkaiLocalSupport_headers: string = '';

    constructor(
        private skipFeedback: boolean,
        private language: Language,
        private test: Requirement,
        private llmModel: BaseEngine,
        private advancedLlmModel: BaseEngine,
        private stream: boolean,
        toolType: 'shinkai' | 'mcp' = 'shinkai'
    ) {
        this.fileManager = new FileManager(language, test.code, stream);
        this.llmFormatter = new LLMFormatter(this.fileManager);
        this.startTime = Date.now();
        this.toolType = toolType;
    }

    private async initialize() {
        const completeShinkaiPrompts = await getFullHeadersAndTools();


        if (this.language === 'typescript') {
            this.shinkaiLocalSupport_headers = completeShinkaiPrompts.typescript.headers["shinkai-local-support"];
            if (await this.fileManager.exists(20001, 'tool_headers', 'tool_headers.ts')) {
                this.shinkaiLocalTools_headers = await this.fileManager.load(20000, 'tool_headers', 'tool_headers.ts');
                this.shinkaiLocalTools_libraryCode = await this.fileManager.load(20001, 'tool_headers', 'tool_headers.ts');
                this.shinkaiLocalTools_toolRouterKeys = JSON.parse(await this.fileManager.load(20002, 'tool_headers', 'tool_headers.json'));
            }
        } else if (this.language === 'python') {
            this.shinkaiLocalSupport_headers = completeShinkaiPrompts.python.headers["shinkai_local_support"];
            if (await this.fileManager.exists(20001, 'tool_headers', 'tool_headers.py')) {
                this.shinkaiLocalTools_headers = await this.fileManager.load(20000, 'tool_headers', 'tool_headers.py');;
                this.shinkaiLocalTools_libraryCode = await this.fileManager.load(20001, 'tool_headers', 'tool_headers.py');;
                this.shinkaiLocalTools_toolRouterKeys = JSON.parse(await this.fileManager.load(20002, 'tool_headers', 'tool_headers.json'));
            }
        }

        // this.shinkaiPrompts = completeShinkaiPrompts[this.language];
        // this.availableTools = completeShinkaiPrompts.availableTools;
        // await this.fileManager.log(`=========================================================`, true);
        await this.fileManager.log(`🔨 Starting Code Generation for #[${this.test.id}] ${this.test.code} @ ${this.language} (Tool Type: ${this.toolType})`, true);
    }

    private async generateRequirements() {
        // Check if output file exists
        if (await this.fileManager.exists(this.step, 'c', 'requirements.md') &&
            await this.fileManager.exists(this.step, 'x', 'promptHistory.json')
        ) {
            // If skipping this was processed before, just adding into the prompt history
            await this.fileManager.log(` Step ${this.step} - Requirements & Feedback `, true);
            const existingFile = await this.fileManager.load(this.step, 'c', 'requirements.md');
            this.feedback = existingFile;
            const promptHistory = await this.fileManager.load(this.step, 'x', 'promptHistory.json');
            this.promptHistory = JSON.parse(promptHistory);
            this.step++;
            return;
        }

        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
            this.fileManager.log(`[Planning Step ${this.step}] System Requirements & Feedback Prompt`, true);
            let headers: string = '';
            if (this.toolType === 'shinkai') {
                headers = this.shinkaiLocalTools_headers +
                    "\n" +
                    this.shinkaiLocalSupport_headers;
            } else {
                headers = "NONE"
            }

            let user_prompt = this.test.prompt;
            if (this.toolType === 'mcp') {
                user_prompt += "\n\nNo matter what was said before, the \"Internal Libraries\" section is always NONE."
            }

            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/requirements-feedback.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${user_prompt}\n\n</input_command>`
            )
                .replace(/\{LANGUAGE\}/g, this.language)
                .replace(/\{RUNTIME\}/g, this.language === 'typescript' ? 'Deno' : 'Python')
                .replace("<internal-libraries>\n\n</internal-libraries>", `<internal-libraries>\n${headers}\n</internal-libraries>`)
            await this.fileManager.save(this.step, 'a', prompt, 'requirements-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined, "Analyzing Requirements & Generating Feedback");
            await this.fileManager.save(this.step, 'x', JSON.stringify(llmResponse.metadata), 'promptHistory.json');
            this.promptHistory = llmResponse.metadata;
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-requirements-response.md');
            return llmResponse.message;
        }, 'markdown', {
            regex: [
                new RegExp("# Requirements"),
                new RegExp("# Standard Libraries"),
                new RegExp("# Internal Libraries"),
                new RegExp("# External Libraries"),
                new RegExp("# Example Input and Output"),
            ]
        });
        this.feedback = parsedLLMResponse;
        await this.fileManager.save(this.step, 'c', this.feedback, 'requirements.md');

        this.step++;

        if (!this.skipFeedback) {
            // let's terminate the pipeline if the user feedback is not provided
            console.log(JSON.stringify({ markdown: this.feedback }));
            throw new Error('REQUEST_FEEDBACK');
        }

    }

    private async processUserFeedback() {
        const user_feedback = this.test.feedback;
        if (!user_feedback) {
            throw new Error('missing feedback');
        }

        let moreFeedback = true;

        while (moreFeedback) {
            // Check if output file exists
            if (await this.fileManager.exists(this.step, 'c', 'feedback.md')) {
                await this.fileManager.log(` Step ${this.step} - User Requirements & Feedback `, true);
                this.feedback = await this.fileManager.load(this.step, 'c', 'feedback.md');
                this.promptHistory = JSON.parse(await this.fileManager.load(this.step, 'x', 'promptHistory.json'));
                this.step++;
                moreFeedback = true
            } else {
                moreFeedback = false;
            }
        }


        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {

            this.fileManager.log(`[Planning Step ${this.step}] User Requirements & Feedback Prompt`, true);

            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/feedback.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${user_feedback}\n\n</input_command>`
            );
            await this.fileManager.save(this.step, 'a', prompt, 'feedback-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, this.promptHistory, "Processing User Feedback");
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-feedback-response.md');

            this.promptHistory = llmResponse.metadata;
            await this.fileManager.save(this.step, 'x', JSON.stringify(this.promptHistory, null, 2), 'promptHistory.json');

            return llmResponse.message;
        }, 'markdown', {
            regex: [
                new RegExp("# Requirements"),
                new RegExp("# Standard Libraries"),
                new RegExp("# Internal Libraries"),
                new RegExp("# External Libraries"),
                new RegExp("# Example Input and Output"),
            ]
        });

        this.feedback = parsedLLMResponse;
        await this.fileManager.save(this.step, 'c', this.feedback, 'feedback.md');
        this.step++;
    }

    private async processLibrarySearch() {

        let parsedLLMResponse = ''
        if (await this.fileManager.exists(this.step, 'c', 'library.json')) {
            await this.fileManager.log(` Step ${this.step} - Library Search `, true);
            const existingLibraryJson = await this.fileManager.load(this.step, 'c', 'library.json');
            parsedLLMResponse = existingLibraryJson;
            // Load existing dependency docs
        } else {
            parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
                this.fileManager.log(`[Planning Step ${this.step}] Library Search Prompt`, true);
                const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/library.md')).replace(
                    '<input_command>\n\n</input_command>',
                    `<input_command>\n${this.feedback}\n\n</input_command>`
                );
                await this.fileManager.save(this.step, 'a', prompt, 'library-prompt.md');
                const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined, "Searching for Required Libraries");
                const promptResponse = llmResponse.message;
                await this.fileManager.save(this.step, 'b', promptResponse, 'raw-library-response.md');
                return promptResponse;
            }, 'json', {
                isJSONArray: true
            });

            await this.fileManager.save(this.step, 'c', parsedLLMResponse, 'library.json');
        }


        const libQueries = JSON.parse(parsedLLMResponse) as string[];
        const codes = 'defghijklmnopqrstuvwxyz';
        const docManager = new DependencyDoc(this.llmModel, this.fileManager);
        for (const [index, library] of libQueries.entries()) {
            const safeLibraryName = library.replace(/[^a-zA-Z0-9]/g, '_').toLocaleLowerCase();
            if (!FORCE_DOCS_GENERATION && await this.fileManager.exists(this.step, codes[index % codes.length], safeLibraryName + '-dependency-doc.md')) {
                await this.fileManager.log(` Step ${this.step} - Dependency Doc `, true);
                const existingFile = await this.fileManager.load(this.step, codes[index % codes.length], safeLibraryName + '-dependency-doc.md');
                this.docs[library] = existingFile;
            } else {
                this.fileManager.log(`[Planning Step ${this.step}] Dependency Doc Prompt : ${library}`, true);
                const dependencyDoc = await docManager.getDependencyDocumentation(library, this.language);
                this.docs[library] = dependencyDoc;
                await this.fileManager.save(this.step, codes[index % codes.length], dependencyDoc, safeLibraryName + '-dependency-doc.md');
            }
        }

        this.step++;
    }

    private async processInternalTools() {
        // Check if output file exists
        if (await this.fileManager.exists(this.step, 'c', 'internal-tools.json')) {
            await this.fileManager.log(` Step ${this.step} - Internal Tools `, true);
            const existingFile = await this.fileManager.load(this.step, 'c', 'internal-tools.json');
            this.internalToolsJSON = JSON.parse(existingFile) as string[];
            this.step++;
            return;
        }
        const availableTools = this.shinkaiLocalTools_toolRouterKeys.map(key => `${key.toolRouterKey} ${key.functionName}`);
        // console.log(JSON.stringify({ availableTools }));
        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
            this.fileManager.log(`[Planning Step ${this.step}] Internal Libraries Prompt`, true);
            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/internal-tools.md')).replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${this.feedback}\n\n</input_command>`
            ).replace(
                '<tool_router_key>\n\n</tool_router_key>',
                `<tool_router_key>\n${availableTools.join('\n')}\n</tool_router_key>`)
            await this.fileManager.save(this.step, 'a', prompt, 'internal-tools-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined, "Identifying Required Internal Tools");
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-internal-tools-response.md');
            return llmResponse.message;
        }, 'json', {
            regex: [
                new RegExp(".+?:::.+?:::.+?"),
            ],
            isJSONArray: true
        });

        await this.fileManager.save(this.step, 'c', parsedLLMResponse, 'internal-tools.json');
        this.internalToolsJSON = JSON.parse(parsedLLMResponse) as string[];
        this.step++;
    }

    private async generatePlan() {
        // Check if output file exists
        if (await this.fileManager.exists(this.step, 'c', 'plan.md')) {
            await this.fileManager.log(` Step ${this.step} - Development Plan `, true);
            const existingFile = await this.fileManager.load(this.step, 'c', 'plan.md');
            this.plan = existingFile;
            this.step++;
            return;
        }
        const internalTools = await getInternalTools(this.language, this.internalToolsJSON);
        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
            this.fileManager.log(`[Planning Step ${this.step}] Generate Development Plan`, true);

            // Create a documentation string from all the library docs
            const libraryDocsString = Object.entries(this.docs).map(([library, doc]) => `
# ${library}
${doc}
`).join('\n\n');

            // TODO Refetch only used libaries
            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/plan.md')).replace(
                '<initial_requirements>\n\n</initial_requirements>',
                `<initial_requirements>\n${this.feedback}\n\n</initial_requirements>`
            ).replace(
                '<libraries_documentation>\n\n</libraries_documentation>',
                `<libraries_documentation>\n${libraryDocsString}\n</libraries_documentation>`
            ).replace(
                '<internal_libraries>\n\n</internal_libraries>',
                `<internal_libraries>\n${internalTools.tools}\n</internal_libraries>`
            ).replace('{RUNTIME}', this.language === 'typescript' ? 'Deno' : 'Python')


            await this.fileManager.save(this.step, 'a', prompt, 'plan-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined, "Creating Development Plan");
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-plan-response.md');
            return llmResponse.message;
        }, 'markdown', {
            regex: [
                new RegExp("# Development Plan"),
                new RegExp("# Example Input and Output "),
                new RegExp("# Config"),
            ]
        });

        this.plan = parsedLLMResponse;
        console.log(JSON.stringify({ markdown: this.plan }));
        await this.fileManager.save(this.step, 'c', this.plan, 'plan.md');
        this.step++;
    }

    private async generateCode() {
        // Check if output file exists
        if (this.language === 'typescript' && await this.fileManager.exists(this.step, 'c', 'tool.ts')) {
            await this.fileManager.log(` Step ${this.step} - Tool code `, true);
            const existingFile = await this.fileManager.load(this.step, 'c', 'tool.ts');
            this.code = existingFile;
            this.step++;
            return;
        }
        if (this.language === 'python' && await this.fileManager.exists(this.step, 'c', 'tool.py')) {
            await this.fileManager.log(` Step ${this.step} - Tool code `, true);
            const existingFile = await this.fileManager.load(this.step, 'c', 'tool.py');
            this.code = existingFile;
            this.step++;
            return;
        }

        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {

            this.fileManager.log(`[Planning Step ${this.step}] Generate the tool code`, true);
            let toolPrompt = '';
            if (this.language === 'typescript') {
                toolPrompt = (await new ShinkaiAPI().getTypescriptToolImplementationPrompt(this.internalToolsJSON)).codePrompt;
            } else {
                toolPrompt = (await new ShinkaiAPI().getPythonToolImplementationPrompt(this.internalToolsJSON)).codePrompt;
            }

            const toolCode_1 = toolPrompt.replace(
                '<input_command>\n\n</input_command>',
                `<input_command>\n${this.plan}\n\n</input_command>`
            );


            let alternativeHeaders = '';
            if (this.language === 'typescript') {
                if (await this.fileManager.exists(20001, 'tool_headers', 'tool_headers.ts')) {
                    alternativeHeaders = await this.fileManager.load(20001, 'tool_headers', 'tool_headers.ts');
                }
            } else if (this.language === 'python') {
                if (await this.fileManager.exists(20001, 'tool_headers', 'tool_headers.py')) {
                    alternativeHeaders = await this.fileManager.load(20001, 'tool_headers', 'tool_headers.py');
                }
            }

            const toolCode_2 = toolCode_1
                .replace("Import these functions with the format: `import { xx } from './shinkai-local-tools.ts'", '')
                .replace(/<file-name=shinkai-local-tools>[\s\S]*?<\/file-name=shinkai-local-tools>/g, '')
                .replace(/<\/file-name=shinkai-local-support>/, `</file-name=shinkai-local-support>

Import these functions with the format: \`import { xx } from './shinkai-local-tools.ts'\`
<file-name=shinkai-local-tools>
${alternativeHeaders}
</file-name=shinkai-local-tools>
`
                );



            const additionalRules = this.language === 'typescript' ? `
    * Use "Internal Libraries" with \`import { xx } from './shinkai-local-support.ts\`; 
    * Use "External Libraries" with \`import { xx } from 'npm:xx'\`;
        ` : '';
            const toolCode = `
<libraries_documentation>
${Object.entries(this.docs).map(([library, doc]) => `
    The folling libraries_documentation tags are just for reference on how to use the libraries, and do not imply how to implement the rules below.
    <library_documentation=${library}>
    # ${library}
    ${doc}
    </library_documentation=${library}>
    The libraries_documentation ended, everything before if for reference only.
    Now, the prompt begins:
`).join('\n')}
</libraries_documentation>
        ` + toolCode_2.replace(
                "* Prefer libraries in the following order:",
                `
    * As first preference use the libraries described in the "Internal Libraries" and "External Libraries" sections.
${additionalRules}
    * For missing and additional required libraries, prefer the following order:`
            );
            await this.fileManager.save(this.step, 'a', toolCode, 'code-prompt.md');
            const llmResponse = await this.advancedLlmModel.run(toolCode, this.fileManager, undefined, "Generating Tool Code");
            const promptResponse = llmResponse.message;

            await this.fileManager.save(this.step, 'b', promptResponse, 'raw-code-response.md');
            return promptResponse;
        }, this.language, {
            regex: [
                this.language === 'typescript' ? new RegExp("function run") : new RegExp("def run")
            ]
        });

        this.code = parsedLLMResponse
        if (this.language === 'typescript') {
            await this.fileManager.save(this.step, 'c', parsedLLMResponse || '', 'tool.ts');
        } else {
            await this.fileManager.save(this.step, 'c', parsedLLMResponse || '', 'tool.py');
        }
        this.step++;
    }

    private async checkGeneratedCode(): Promise<{ warnings: boolean }> {
        const shinkaiAPI = new ShinkaiAPI();
        let checkResult: CheckCodeResponse;
        if (await this.fileManager.exists(this.step, 'a', 'code-check-results.json')) {
            const existingFile = await this.fileManager.load(this.step, 'a', 'code-check-results.json');
            checkResult = JSON.parse(existingFile) as CheckCodeResponse;
        } else {

            const additional_headers: Record<string, string> = {};
            if (this.language === 'typescript') {
                if (await this.fileManager.exists(20001, 'tool_headers', 'tool_headers.ts')) {
                    additional_headers["shinkai-local-support"] = await this.fileManager.load(20001, 'tool_headers', 'tool_headers.ts');
                } else {
                    console.log('[Warning] Not using local tools.');
                }
            } else {
                if (await this.fileManager.exists(20001, 'tool_headers', 'tool_headers.py')) {
                    additional_headers["shinkai-local-support"] = await this.fileManager.load(20001, 'tool_headers', 'tool_headers.py');
                } else {
                    console.log('[Warning] Not using local tools.');
                }
            };

            checkResult = await shinkaiAPI.checkCode(this.language, this.code, additional_headers);
            this.fileManager.log(`[Planning Step ${this.step}] Code check results ${checkResult.warnings.length} warnings`, true);
            await this.fileManager.save(this.step, 'a', JSON.stringify(checkResult, null, 2), 'code-check-results.json');
        }

        if (checkResult.warnings.length > 0) {

            if (this.language === 'typescript' && await this.fileManager.exists(this.step, 'd', 'fixed-tool.ts')) {
                await this.fileManager.log(` Step ${this.step} - Fixed code `, true);
                const existingFile = await this.fileManager.load(this.step, 'd', 'fixed-tool.ts');
                this.code = existingFile;
                this.step++;
                return { warnings: true };
            }
            if (this.language === 'python' && await this.fileManager.exists(this.step, 'd', 'fixed-tool.py')) {
                await this.fileManager.log(` Step ${this.step} - Fixed code `, true);
                const existingFile = await this.fileManager.load(this.step, 'd', 'fixed-tool.py');
                this.code = existingFile;
                this.step++;
                return { warnings: true };
            }
            this.fileManager.log(`[Planning Step ${this.step}] Check generated code`, true);

            const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {

                let warningString = checkResult.warnings.join('\n')
                    .replace(/file:\/\/\/[a-zA-Z0-9_\/-]+?\/code\/[a-zA-Z0-9_-]+?\//g, '/')
                    .replace(/Stack backtrace:[\s\S]*/, '');
                if (this.language === 'typescript') {
                    warningString = warningString.replace(/^Download [^ ]+$/g, '');
                }
                // Read the fix-code prompt
                const fixCodePrompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/fix-code.md'))
                    .replace('<warnings>\n\n</warnings>', `<warnings>\n${warningString}\n</warnings>`)
                    .replace('<code>\n\n</code>', `<code>\n${this.code}\n</code>`)
                    .replace('{RUNTIME}', this.language === 'typescript' ? 'Deno' : 'Python')
                    .replace('{LANG-RULES}', this.language === 'typescript' ? `
All libraries must be imported at the start of the code as either:
\`import { xx } from './shinkai-local-support.ts\`; 
\`import { xx } from 'npm:yyy'\`;
\`import { xx } from 'jsr:@std/yyy'\`;
\`import { xx } from 'node:yyy'\`;
` : `

If the warning suggestes to use either JSR or NPM, then first try using NPM with "npm:xxx"

At the start of the file add a commented toml code block with the dependencies used and required to be downloaded by pip.
Only add the dependencies that are required to be downloaded by pip, do not add the dependencies that are already available in the Python environment.

In the next example tag is an example of the commented script block that MUST be present before any python code or imports, where the exact list of dependencies depends on the source code.
<example>
# /// script
# requires-python = ">=3.10,<3.12"
# dependencies = [
#   "requests",
#   "ruff >=0.3.0",
#   "torch ==2.2.2",
#   "other_dependency",
#   "other_dependency_2",
# ]
# ///
</example>

  * Do not implement __init__ or __new__ methods for CONFIG, INPUTS or OUTPUT. So OUTPUT should be set with dot notation.
`)
                await this.fileManager.save(this.step, 'b', fixCodePrompt, 'fix-code-prompt.md');

                // Run the fix prompt
                const llmResponse = await this.llmModel.run(fixCodePrompt, this.fileManager, undefined, "Fixing Code Warnings");
                await this.fileManager.save(this.step, 'c', llmResponse.message, 'raw-fix-code-response.md');
                return llmResponse.message;
            }, this.language, {
                regex: [
                    this.language === 'typescript' ? new RegExp("function run") : new RegExp("def run")
                ]
            });

            // Extract and save the fixed code
            this.code = parsedLLMResponse;
            if (this.language === 'typescript') {
                await this.fileManager.save(this.step, 'd', parsedLLMResponse || '', 'fixed-tool.ts');
            } else {
                await this.fileManager.save(this.step, 'd', parsedLLMResponse || '', 'fixed-tool.py');
            }
            this.step++;
            return { warnings: true }
        } else {
            // Nothing to fix
            this.fileManager.log(`[Planning Step ${this.step}] No warnings found`, true);

            this.step++;
            return { warnings: false }
        }
    }


    private async generateTests() {
        // Check if output file exists
        if (await this.fileManager.exists(this.step, 'c', 'tests.json')) {
            await this.fileManager.log(` Step ${this.step} - Tests `, true);
            const existingFile = await this.fileManager.load(this.step, 'c', 'tests.json');
            console.log(`EVENT: tests\n${JSON.stringify(JSON.parse(existingFile))}`);
            this.step++;
            return;
        }

        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
            this.fileManager.log(`[Planning Step ${this.step}] Generate test cases`, true);

            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/test.md'))
                .replace('<requirement>\n\n</requirement>', `<requirement>\n${this.feedback}\n</requirement>`)
                .replace('<code>\n\n</code>', `<code>\n${this.code}\n</code>`);

            await this.fileManager.save(this.step, 'a', prompt, 'test-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined, "Generating Test Cases");
            const promptResponse = llmResponse.message;
            await this.fileManager.save(this.step, 'b', promptResponse, 'raw-test-response.md');
            return promptResponse;
        }, 'json', {
            isJSONArray: true,
            // Regex asumes its a string...
            // regex: [
            //     new RegExp("input"),
            //     new RegExp("output"),
            //     new RegExp("config"),
            // ]
        });

        await this.fileManager.save(this.step, 'c', parsedLLMResponse, 'tests.json');
        console.log(`EVENT: tests\n${JSON.stringify({ tests: JSON.parse(parsedLLMResponse) })}`);
        this.step++;
    }

    private async logCompletion() {
        const end = Date.now();
        const time = end - this.startTime;
        await this.fileManager.log(`[Done] took ${time}ms (Tool Type: ${this.toolType})`, true);
        // await this.fileManager.log(`code available at ${this.fileManager.toolDir}/src`, true);
    }

    private async processFeedbackAnalysis(): Promise<'changes-requested' | 'no-changes'> {

        const user_prompt = this.test.prompt;
        if (user_prompt === "") return 'no-changes';
        if (!user_prompt) return 'no-changes';

        const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
            this.fileManager.log(`[Planning Step ${this.step}] Feedback Analysis Prompt`, true);

            const prompt = (await Deno.readTextFile(Deno.cwd() + '/prompts/feedback_analysis.md')).replace(
                '<feedback>\n\n</feedback>',
                `<feedback>\n${user_prompt}\n</feedback>`
            );
            await this.fileManager.save(this.step, 'a', prompt, 'feedback-analysis-prompt.md');
            const llmResponse = await this.llmModel.run(prompt, this.fileManager, undefined, "Analyzing User Feedback");
            await this.fileManager.save(this.step, 'b', llmResponse.message, 'raw-feedback-analysis-response.md');
            return llmResponse.message;
        }, 'json', {
            regex: [
                /"result"/,
            ]
        });
        const analysisResult = JSON.parse(parsedLLMResponse);
        if (analysisResult.result === 'changes-requested') {
            return 'changes-requested';
        } else {
            return 'no-changes';
        }
    }

    public async generateMCP() {
        // Only generate MCP config if toolType is 'mcp'
        if (this.toolType !== 'mcp') {
            console.log('Skipping MCP generation as tool type is not MCP');
            return;
        }

        const srcPath = path.join(this.fileManager.toolDir, `src`);
        const mcp = await Deno.readTextFile(Deno.cwd() + '/templates/mcp.ts');
        const denojson = await Deno.readTextFile(Deno.cwd() + '/templates/deno.json');
        const metadata = await Deno.readTextFile(Deno.cwd() + '/templates/deno.lock');
        Deno.writeTextFileSync(path.join(srcPath, 'mcp.ts'), mcp);
        Deno.writeTextFileSync(path.join(srcPath, 'deno.json'), denojson);
        Deno.writeTextFileSync(path.join(srcPath, 'deno.lock'), metadata);
        const mcp_name = JSON.parse(this.metadata).name.toLocaleLowerCase().replace(/[^a-z0-9_]/g, '_');
        const markdown = `
# MCP Config
## CURSOR
deno -A ${path.normalize(srcPath)}/src/mcp.ts

## CLAUDE
"mcpServers": {
    "${mcp_name}": {
        "args": [
            "-A",
            "${path.normalize(srcPath)}/src/mcp.ts"
        ],
        "command": "deno"
    }
}
        `;
        console.log(JSON.stringify({ markdown }));
    }

    public async run() {
        try {
            const state = await this.fileManager.loadState();
            if (state.exists && state.completed) {
                console.log('EVENT: progress\n', JSON.stringify({ message: 'Already completed' }));
                return {
                    status: "COMPLETED",
                    code: '',
                    metadata: '',
                }
            }
            if (state.exists && state.feedback_expected) {
                // Probably feedback. Let's check the current step.
                const feedbackAnalysis = await this.processFeedbackAnalysis();
                await this.fileManager.writeState({
                    completed: false,
                    date: new Date().toISOString(),
                    feedback_expected: false,
                });
                if (feedbackAnalysis === 'changes-requested') {
                    this.test.feedback = this.test.prompt;
                } else {
                    this.test.feedback = undefined;
                }
            }

            // const feedbackAnalysis = await this.processFeedbackAnalysis();

            await this.initialize();
            await this.generateRequirements();

            if (this.test.feedback) {
                await this.processUserFeedback();
                if (!this.skipFeedback) {
                    console.log(JSON.stringify({ markdown: this.feedback }));
                    throw new Error('REQUEST_FEEDBACK');
                }
            } else {
                while (await this.fileManager.exists(this.step, 'c', 'feedback.md')) {
                    this.feedback = await this.fileManager.load(this.step, 'c', 'feedback.md');

                    console.log('EVENT: feedback\n', JSON.stringify({ message: 'Step ' + this.step + ' - Processing feedback' }));
                    this.step++;
                }
            }

            await this.processLibrarySearch();
            await this.processInternalTools();
            await this.generatePlan();
            await this.generateCode();
            let retries = 5;
            while (retries > 0) {
                const { warnings } = await this.checkGeneratedCode();
                if (!warnings) break;
                retries--;
            }
            console.log(`EVENT: code\n${JSON.stringify({ code: this.code })}`);

            const doTestAndMetadata = false;
            if (doTestAndMetadata) {
                const metadataPipeline = new ShinkaiPipelineMetadata(this.code, this.language, this.test, this.llmModel, this.stream);
                const metadataResult = await metadataPipeline.run();
                this.metadata = metadataResult.metadata;
                await this.generateTests();
            }
            await this.fileManager.saveFinal(this.code, this.metadata || '');

            await this.generateMCP();
            await this.logCompletion();

            console.log(`EVENT: metadata\n${JSON.stringify({ metadata: this.metadata })}`);

            return {
                code: this.code,
                metadata: this.metadata,
            }
        } catch (e) {
            if (e instanceof Error && e.message === 'REQUEST_FEEDBACK') {
                this.fileManager.writeState({
                    completed: false,
                    date: new Date().toISOString(),
                    feedback_expected: true,
                });
                console.log("EVENT: request-feedback");
                // console.log(`EVENT: feedback\n${ JSON.stringify({ feedback: this.feedback }) }`);
                return {
                    status: "REQUEST_FEEDBACK",
                    code: '',
                    metadata: '',
                }
            } else {
                console.log(String(e));
                return {
                    status: "ERROR",
                    code: '',
                    metadata: '',
                }
            }
        }
    }
}