import axios from "npm:axios";
import { BaseEngine } from "./BaseEngine.ts";

const ollamaApiUrl = Deno.env.get("OLLAMA_API_URL") ?? "http://localhost:11434";

export class OllamaEngine extends BaseEngine {
  override async run(prompt: string): Promise<string> {
    const payload = this.payload(prompt);
    const response = await axios({
      url: `${ollamaApiUrl}/api/chat`,
      method: "POST",
      data: JSON.stringify(payload),
    });
    return response.data.message.content;
  }

  static override async getInstalledModels(): Promise<BaseEngine[]> {
    try {
      const response = await axios({
        method: "GET",
        url: `${ollamaApiUrl}/api/tags`,
      });
      return response.data.models.map((m: { model: string }) =>
        new OllamaEngine(m.model)
      );
    } catch (e) {
      console.log("Error:", e.message);
      console.log(`Ollama is not running at ${ollamaApiUrl}`);
      return [];
    }
  }

  // Ollama specific methods
  private payload(prompt: string) {
    return {
      "model": this.name,
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
      "options": {
        // "num_ctx": 104901
        "num_ctx": 20000,
      },
      "stream": false,
    };
  }
}
