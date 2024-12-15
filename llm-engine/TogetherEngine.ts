import axios from "npm:axios";
import { BaseEngine } from "./BaseEngine.ts";

const togetherApiUrl = "https://api.together.xyz/v1/chat/completions";
const togetherApiKey = Deno.env.get("TOGETHER_API_KEY");

export class TogetherEngine extends BaseEngine {
  override async run(prompt: string): Promise<string> {
    if (!togetherApiKey) {
      throw new Error("TOGETHER_API_KEY environment variable not set");
    }

    const start = Date.now();
    const payload = this.payload(prompt);
    const response = await axios({
      url: togetherApiUrl,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${togetherApiKey}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    });
    const end = Date.now();
    console.log(
      `    [Benchmark] Together.ai took ${end - start}ms for ${
        prompt.substring(0, 100)
      } ... ${prompt.substring(prompt.length - 100)}`.replace(/\n/g, " "),
    );
    return response.data.choices[0].message.content;
  }

  private payload(prompt: string) {
    return {
      model: this.name,
      messages: [
        {
          role: "system",
          content: "You are a very helpful assistant. You may be provided with documents or content to analyze and answer questions about them, in that case refer to the content provided in the user message for your responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: false,
    };
  }

  static override async getInstalledModels(): Promise<BaseEngine[]> {
    // Together.ai doesn't have a model list endpoint
    // Models will be specified in models.txt
    return [];
  }
}
