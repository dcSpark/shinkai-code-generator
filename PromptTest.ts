import axios from "npm:axios";

export type PromptTestResult = { prompt: string; raw: string; src: string | null };
export class PromptTest {
  private apiUrl: string;

  constructor(private prompt: string, private model: string) {
    this.apiUrl = Deno.env.get("OLLAMA_API_URL") ?? "http://localhost:11434";
  }

  private async codePrompt(task: string) {
    return `${await Deno.readTextFile("./prompts/create-tool.md")}\n${task}\n`;
  }

  private async metadataPrompt(task: string) {
    return `${await Deno.readTextFile(
      "./prompts/create-metadata.md",
    )}\n${task}\n`;
  }

  private payload(prompt: string) {
    return {
      "model": this.model,
      "messages": [
        {
          "role": "system",
          "content":
            "You are a very helpful assistant. You may be provided with documents or content to analyze and answer questions about them, in that case refer to the content provided in the user message for your responses.",
        },
        {
          "role": "user",
          "content": prompt,
          "images": [],
        },
      ],
      "stream": false,
      "options": {
        "seed": 101,
        "temperature": 0,
      },
    };
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
    const codePayload = this.payload(codePrompt);
    const code_response = await axios({
      url: `${this.apiUrl}/api/chat`,
      method: "POST",
      data: JSON.stringify(codePayload),
    });
    const raw = code_response.data.message.content;
    const code = this.tryToExtractTS(raw);
    return { prompt: codePrompt, raw, src: code };
  }

  private async generateMetadata(code: string): Promise<PromptTestResult> {
    const metadataPrompt = await this.metadataPrompt(code);
    const metadataPayload = this.payload(metadataPrompt);
    const metadata_response = await axios({
      url: `${this.apiUrl}/api/chat`,
      method: "POST",
      data: JSON.stringify(metadataPayload),
    });
    const raw = metadata_response.data.message.content;
    const metadata = this.tryToExtractJSON(raw);
    return { prompt: metadataPrompt, raw, src: metadata };
  }

  public async run(): Promise<{ code: PromptTestResult; metadata: PromptTestResult | null }> {
    const code = await this.generateCode(this.prompt);
    const metadata = code.src ? await this.generateMetadata(code.src) : null;
    return { code, metadata };
  }
}