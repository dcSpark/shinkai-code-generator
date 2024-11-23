import { TEST } from "../tests.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";

export type PromptTestResult = {
  prompt: string;
  raw: string;
  src: string | null;
};
export class PromptTest {
  constructor(
    private test: TEST,
    private model: BaseEngine,
  ) {}

  private async codePrompt(task: string) {
    return `${await Deno.readTextFile(
      `./results/${this.test.code}/${this.model.name}/raw-prompts/create-tool.md`,
    )}\n${task}\n`;
  }

  private async metadataPrompt(task: string) {
    return `${await Deno.readTextFile(
      `./results/${this.test.code}/${this.model.name}/raw-prompts/create-metadata.md`,
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

  public async run(): Promise<
    { code: PromptTestResult; metadata: PromptTestResult | null }
  > {
    const code = await this.generateCode(this.test.prompt);
    const metadata = code.src ? await this.generateMetadata(code.src) : null;
    return { code, metadata };
  }
}
