import axios from "npm:axios";
import { TestFileManager } from "./TestFileManager.ts";
export abstract class BaseEngine {
  public readonly path: string;
  public readonly shinkaiName: string;
  constructor(public readonly name: string) {
    this.path = name.replaceAll(/[^a-zA-Z0-9]/g, "-");
    // TODO how to generate names correctly for shinkai?
    this.shinkaiName = `o_${name.replaceAll(/[^a-zA-Z0-9]/g, "_")}`;
    // console.log({ name: this.shinkaiName, path: this.path });
  }

  abstract run(
    prompt: string,
    logger: TestFileManager | undefined,
    payloadHistory: Payload | undefined
  ): Promise<{ message: string, metadata: Payload }>;

  // This should return an array of subclasses of BaseEngine instances, one per model.
  static getInstalledModels(): Promise<BaseEngine[]> {
    throw new Error("Implement this in the subclass");
  }
}

const ollamaApiUrl = Deno.env.get("OLLAMA_API_URL")

export function getLlama318bInstruct() {
  return new OllamaEngine('llama3.1:8b-instruct-q4_1');
}
export function getDeepSeekR132B() {
  return new OllamaEngine('deepseek-r1:32b');
}

class OllamaEngine extends BaseEngine {
  override async run(
    prompt: string,
    logger: TestFileManager | undefined = undefined,
    payloadHistory: Payload | undefined = undefined,
  ): Promise<{ message: string, metadata: Payload }> {
    const start = Date.now();
    let payload = payloadHistory ? this.addToPayload(prompt, 'user', payloadHistory) : this.newPayload(prompt);
    if (!ollamaApiUrl) {
      throw new Error("OLLAMA_API_URL is not set");
    }
    const response = await axios({
      url: `${ollamaApiUrl}/api/chat`,
      method: "POST",
      data: JSON.stringify(payload),
    });
    const end = Date.now();

    const time = end - start;
    const prompt_short = prompt.substring(0, 50) + "..." + prompt.substring(prompt.length - 50);
    logger?.log(`[Benchmark] Ollama took ${time}ms for ${prompt_short}`.replace(/\n/g, " "));
    payload = this.addToPayload(response.data.message.content, 'assistant', payload);
    return {
      message: response.data.message.content,
      metadata: payload
    };
  }

  public static async fetchModels(): Promise<string[]> {
    const response = await axios<{ models: { model: string }[] }>({
      url: `${ollamaApiUrl}/api/tags`,
      method: "GET",
    });
    return response.data.models
      .filter((m) => !m.model.startsWith("snowflake-arctic"))
      .map((m) => m.model);
  }

  static override async getInstalledModels(): Promise<BaseEngine[]> {
    try {
      const models = await this.fetchModels();
      return models.map((m) => new OllamaEngine(m));
    } catch (e) {
      console.log("Error:", (e as Error).message);
      console.log(`Ollama is not running at ${ollamaApiUrl}`);
      return [];
    }
  }

  // Ollama specific methods\
  private addToPayload(prompt: string, role: Message['role'], payload: Payload): Payload {
    payload.messages.push({
      "role": role,
      "content": prompt,
    });
    return payload;
  }

  private newPayload(prompt: string): Payload {
    const payload: Payload = {
      "model": this.name,
      "messages": [
        {
          "role": "system",
          "content":
            "You are a very helpful assistant. You may be provided with documents or content to analyze and answer questions about them, in that case refer to the content provided in the user message for your responses.",
        },
      ],
      "options": {
        "num_ctx": 26000,
      },
      "stream": false,
    };
    return this.addToPayload(prompt, 'user', payload);
  }
}

export type Payload = OllamaPayload;

interface OllamaPayload {
  model: string;
  messages: Message[];
  options: Options;
  stream: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Options {
  num_ctx: number;
}
