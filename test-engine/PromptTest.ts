import { Language, TestData } from "../types.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { getAllToolsHeaders } from "./shinkai-prompts.ts";
import { Paths } from "../paths.ts";

export type PromptTestResult = {
  prompt: string;
  raw: string;
  src: string | null;
};
export class PromptTest {
  constructor(
    private language: Language,
    private test: TestData,
    private model: BaseEngine,
  ) {}

  private async codePrompt(task: string) {
    const rawPrompt = await Deno.readTextFile(
      Paths.createTool(this.language, this.test, this.model),
    );
    return rawPrompt.replace(
      /\<input_command\>/g,
      `<input_command>\n${task}\n`,
    );
  }

  private async metadataPrompt(task: string) {
    const rawPrompt = await Deno.readTextFile(
      Paths.createMetadata(this.language, this.test, this.model),
    );

    return rawPrompt.replace(
      /\<input_command\>/g,
      `<input_command>\n${task}\n`,
    );
  }

  private tryToExtractTS(text: string): string | null {
    const regex = /```(?:typescript)?\n([\s\S]+?)\n```/;
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  private tryToExtractPython(text: string): string | null {
    const regex = /```(?:python)?\n([\s\S]+?)\n```/;
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  private tryToExtractJSON(text: string): string | null {
    const regex = /```(?:json)?\n([\s\S]+?)\n```/;
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  private async generateCode(task: string): Promise<PromptTestResult> {
    const codePrompt = await this.codePrompt(task);
    const raw = await this.model.run(codePrompt);
    const code = this.language === "typescript"
      ? this.tryToExtractTS(raw)
      // this.language === "python"
      : this.tryToExtractPython(raw);
    return { prompt: codePrompt, raw, src: code };
  }

  private async generateMetadata(code: string): Promise<PromptTestResult> {
    const metadataPrompt = await this.metadataPrompt(code);
    const raw = await this.model.run(metadataPrompt);
    const metadata = this.tryToExtractJSON(raw);
    return { prompt: metadataPrompt, raw, src: metadata };
  }

  private async augmentMetadata(
    command: string,
    execute = false,
  ): Promise<string | null> {
    const prompt = `
<agent-code-definition>
  Given this signature:
  \`\`\`typescript
  export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT>
  \`\`\`
</agent-code-definition>

<agent-code-output>
  * Define the Typescript type for INPUTS
  * Define the Typescript type for OUTPUT
</agent-code-output>

<agent-code-rules>
  * Write only typescript code in a single code block
  * Avoid all comments, text, notes and metadata.
  * CONFIG is defined outside and cannot be changed.
  * type INPUT = { /* keys */ }
  * type OUTPUT = { /* keys */ }
  * Keep only the minimum keys required to make the command viable.
  * Analyze the instruction in the command tag and define the INPUTS and OUTPUT following the rules above.
</agent-code-rules>

<command>
'''
${command}
'''
</command>
`;
    await Deno.writeTextFile(
      Paths.augmentMetadata(this.language, this.test, this.model),
      prompt,
    );

    if (execute) {
      console.log("    [LLM] Metadata augmentation");
      const raw = await this.model.run(prompt);
      return this.tryToExtractTS(raw);
    }

    return null;
  }

  private async selectTools(
    command: string,
    execute = false,
  ): Promise<string | null> {
    const headers = await getAllToolsHeaders();
    const prompt = `
<available-tools-definitions>
  # Available Tools Definitions:
  ${headers}
</available-tools-definitions>

<agent-code-rules>
  * Only return a list of the function names from this list.
  * Avoid all comments, text, notes and metadata.
  * Select the minimum required tools that are needed to execute the instruction in the command tag from this list.
  * If there is a required tool that is not in the list, prefix with '!' to indicate that it is not available, but needed to execute the command tag instruction.
</agent-code-rules>

<command>
'''
${command}
'''
</command>
`;
    await Deno.writeTextFile(
      Paths.selectTools(this.language, this.test, this.model),
      prompt,
    );

    if (execute) {
      console.log("    [LLM] Tools selection");
      const raw = await this.model.run(prompt);
      return raw;
    }
    return null;
  }

  public async fixCode(
    errors: string,
    files: string[],
  ): Promise<{ prompt: string; raw: string; code: string | null }> {
    const code: { file: string; code: string }[] = [];
    for (const file of files) {
      code.push({
        file: file.split("/").pop() || file,
        code: await Deno.readTextFile(file),
      });
    }
    const srcCode = code.map(({ file, code }) =>
      `# File Name ${file}
\`\`\`typescript
${code}
\`\`\`

`
    ).join("\n");
    const prompt = `
<source-codes>
* Here is the program soruce code files:
${srcCode}
</source-codes>

<agent-fix-code-rules>
* Only return the fixed code in a single code block.
* Only make the changes necessary to fix the errors above, no other changes to the code.
* Avoid all comments, text, notes and metadata.
</agent-fix-code-rules>

<errors>
* These are the following errors found:
${errors}
</errors>


    `;
    const raw = await this.model.run(prompt);
    return { prompt, raw, code: this.tryToExtractTS(raw) };
  }

  public async startCodeGeneration(): Promise<
    { code: PromptTestResult }
  > {
    const execute = false;
    const toolsSelected = await this.selectTools(this.test.prompt, execute);
    if (execute) {
      await Deno.writeTextFile(
        Paths.toolsSelected(this.language, this.test, this.model),
        toolsSelected || "",
      );
    }

    const metadataAugmented = await this.augmentMetadata(
      this.test.prompt,
      execute,
    );
    if (execute) {
      await Deno.writeTextFile(
        Paths.metadataAugmented(this.language, this.test, this.model),
        metadataAugmented || "",
      );
    }

    const code = await this.generateCode(
      this.test.prompt + " given " + this.test.prompt_type,
    );
    return { code };
  }

  public async startMetadataGeneration(
    code: string,
  ): Promise<{ metadata: PromptTestResult | null }> {
    const metadata = code ? await this.generateMetadata(code) : null;
    return { metadata };
  }
}
