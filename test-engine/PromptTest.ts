import { TestData } from "../types.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { getAllToolsHeaders } from "./shinkai-prompts.ts";

export type PromptTestResult = {
  prompt: string;
  raw: string;
  src: string | null;
};
export class PromptTest {
  constructor(
    private test: TestData,
    private model: BaseEngine,
  ) {}

  private async codePrompt(task: string) {
    return `${await Deno.readTextFile(
      `./results/${
        this.test.id?.toString().padStart(5, "0")
      }-${this.test.code}/${this.model.path}/raw-prompts/create-tool.md`,
    )}\n${task}\n`;
  }

  private async metadataPrompt(task: string) {
    return `${await Deno.readTextFile(
      `./results/${
        this.test.id?.toString().padStart(5, "0")
      }-${this.test.code}/${this.model.path}/raw-prompts/create-metadata.md`,
    )}\n${task}\n`;
  }

  private tryToExtractTS(text: string): string | null {
    const regex = /```(?:typescript)?\n([\s\S]+?)\n```/;
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
    const code = this.tryToExtractTS(raw);
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
    const prompt = `Given this signature:
\`\`\`typescript
export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT>
\`\`\`

1. Define the Typescript type for INPUTS
2. Define the Typescript type for OUTPUT

* Write only typescript code in a single code block
* Avoid all comments, text, notes and metadata.
* CONFIG is defined outside and cannot be changed.
* type INPUT = { /* keys */ }
* type OUTPUT = { /* keys */ }
* Keep only the minimum keys required to make the command viable.

For this command:
'''
${command}
'''
`;
    Deno.writeTextFile(
      `./results/${
        this.test.id?.toString().padStart(5, "0")
      }-${this.test.code}/${this.model.path}/raw-prompts/augment-metadata.md`,
      prompt,
    );

    if (execute) {
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
# Available Tools Definitions:
${headers}

* Only return a list of the function names from this list.
* Avoid all comments, text, notes and metadata.
* Select the tools that are needed to execute the command from this list.

# Given this command:
'''
${command}
'''

`;
    Deno.writeTextFile(
      `./results/${
        this.test.id?.toString().padStart(5, "0")
      }-${this.test.code}/${this.model.path}/raw-prompts/select-tools.md`,
      prompt,
    );

    if (execute) {
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
* Here is the program soruce code files:
${srcCode}

* Only return the fixed code in a single code block.
* Only make the changes necessary to fix the errors above, no other changes to the code.
* Avoid all comments, text, notes and metadata.
* These are the following errors found:
${errors}


    `;
    const raw = await this.model.run(prompt);
    return { prompt, raw, code: this.tryToExtractTS(raw) };
  }

  public async run(): Promise<
    { code: PromptTestResult; metadata: PromptTestResult | null }
  > {
    const toolsSelected = await this.selectTools(this.test.prompt);
    if (toolsSelected) {
      Deno.writeTextFile(
        `./results/${
          this.test.id?.toString().padStart(5, "0")
        }-${this.test.code}/${this.model.path}/tools-selected.txt`,
        toolsSelected || "",
      );
    }

    const metadataAugmented = await this.augmentMetadata(this.test.prompt);
    if (metadataAugmented) {
      Deno.writeTextFile(
        `./results/${
          this.test.id?.toString().padStart(5, "0")
        }-${this.test.code}/${this.model.path}/metadata-augmented.txt`,
        metadataAugmented || "",
      );
    }

    const code = await this.generateCode(
      this.test.prompt +
        (this.test.sql_store ? ` and store the result in SQL.` : "") +
        " Given " + this.test.prompt_type,
    );

    const metadata = code.src ? await this.generateMetadata(code.src) : null;
    return { code, metadata };
  }
}
