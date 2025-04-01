import axios from "npm:axios";
import { FileManager } from "../ShinkaiPipeline/FileManager.ts";
import { Message, MessageType } from "../ShinkaiPipeline/Message.ts";
import { BaseEngine } from "./BaseEngine.ts";

const ollamaApiUrl = Deno.env.get("OLLAMA_API_URL");

export interface OllamaPayload {
  model: string;
  messages: OllamaMessage[];
  options: {
    num_ctx: number;
  };
  stream: boolean;
}

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class OllamaEngine extends BaseEngine {
  override async run(
    prompt: string,
    logger: FileManager | undefined = undefined,
    payloadHistory: OllamaPayload | undefined = undefined,
    thinkingAbout?: string
  ): Promise<{ message: string; metadata: OllamaPayload, cacheFilePath: string }> {
    const start = Date.now();
    let payload = payloadHistory
      ? this.addToOllamaPayload(prompt, "user", payloadHistory)
      : this.newOllamaPayload(prompt);
    if (!ollamaApiUrl) {
      throw new Error("OLLAMA_API_URL is not set");
    }

    const tokenCount = this.countTokensFromMessageLlama3(JSON.stringify(payload));
    const contextMessage = thinkingAbout || "Processing";
    logger?.log(new Message(MessageType.THINKING, contextMessage));
    logger?.log(new Message(MessageType.DEBUG, `${tokenCount}[tokens]`));

    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000 | 0;
      logger?.log(new Message(MessageType.LOADING, `${elapsed}s`));
    }, 5000);

    const response = await axios({
      url: `${ollamaApiUrl}/api/chat`,
      method: "POST",
      data: JSON.stringify(payload),
    });
    clearInterval(timer);
    await this.addCost(
      logger,
      payload.messages.map((m) => m.content).join("\n"),
      response.data.message.content
    );
    const end = Date.now();

    const time = end - start;
    logger?.log(
      new Message(MessageType.MESSAGE, `AI took ${(time / 1000) | 0}[s] to process ${contextMessage}`)
    );
    payload = this.addToOllamaPayload(
      response.data.message.content,
      "assistant",
      payload
    );
    return {
      message: response.data.message.content,
      metadata: payload,
      cacheFilePath: "",
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

  // Ollama specific methods\
  private addToOllamaPayload(
    prompt: string,
    role: OllamaMessage["role"],
    payload: OllamaPayload
  ): OllamaPayload {
    payload.messages.push({
      role: role,
      content: prompt,
    });
    return payload;
  }

  private newOllamaPayload(prompt: string): OllamaPayload {
    const payload: OllamaPayload = {
      model: this.name,
      messages: [
        {
          role: "system",
          content:
            "You are a very helpful assistant. You may be provided with documents or content to analyze and answer questions about them, in that case refer to the content provided in the user message for your responses.",
        },
      ],
      options: {
        num_ctx: 26000,
      },
      stream: false,
    };
    return this.addToOllamaPayload(prompt, "user", payload);
  }
}
