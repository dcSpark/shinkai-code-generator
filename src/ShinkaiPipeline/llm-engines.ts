import axios from "npm:axios";
import { FileManager } from "./FileManager.ts";

const ollamaApiUrl = Deno.env.get("OLLAMA_API_URL");
const OPEN_AI_KEY = Deno.env.get("OPEN_AI_KEY");

export type Payload = OllamaPayload | OpenAIPayload;

export abstract class BaseEngine {
  public readonly path: string;
  public readonly shinkaiName: string;

  constructor(
    public readonly name: string,
    public readonly thinkingAbout: string = ""
  ) {
    this.path = name.replaceAll(/[^a-zA-Z0-9]/g, "-");
    // TODO how to generate names correctly for shinkai?
    this.shinkaiName = `o_${name.replaceAll(/[^a-zA-Z0-9]/g, "_")}`;
  }

  abstract run(
    prompt: string,
    logger: FileManager | undefined,
    payloadHistory: Payload | undefined,
    thinkingAbout?: string
  ): Promise<{ message: string, metadata: Payload }>;

  // This should return an array of subclasses of BaseEngine instances, one per model.
  static getInstalledModels(): Promise<BaseEngine[]> {
    throw new Error("Implement this in the subclass");
  }
}

export function getLlama318bInstruct(thinkingAbout: string = "") {
  return new OllamaEngine('llama3.1:8b-instruct-q4_1', thinkingAbout);
}

export function getDeepSeekR132B(thinkingAbout: string = "") {
  return new OllamaEngine('deepseek-r1:32b', thinkingAbout);
}

export function getOpenAIO4Mini(thinkingAbout: string = "") {
  return new OpenAI('gpt-4o-mini', thinkingAbout);
}
export function getOpenAIO4(thinkingAbout: string = "") {
  return new OpenAI('gpt-4o', thinkingAbout);
}


interface OpenAIPayload {
  model: string;
  messages: OpenAIMessage[];
  // stream: boolean;
}
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      refusal: null;
    };
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
      audio_tokens: number;
    };
    completion_tokens_details: {
      reasoning_tokens: number;
      audio_tokens: number;
      accepted_prediction_tokens: number;
      rejected_prediction_tokens: number;
    };
  };
  service_tier: string;
  system_fingerprint: string;
}

function countTokensFromMessageLlama3(message: string): number {
  let tokenCount = 0;
  let alphabeticCount = 0;
  let spaceCount = 0;

  // First pass: count alphabetic characters and spaces
  for (const c of message) {
    if (/[a-zA-Z]/.test(c)) {
      alphabeticCount++;
    } else if (/\s/.test(c)) {
      spaceCount++;
    }
  }

  // Calculate how many spaces can be ignored
  const spacesToIgnore = Math.floor(alphabeticCount / 3);

  // Determine the alphabetic token weight based on the number of alphabetic characters
  const alphabeticTokenWeight = alphabeticCount > 500 ? 8 : 10;

  // Second pass: count tokens, adjusting for spaces that can be ignored
  let remainingSpacesToIgnore = spacesToIgnore;
  for (const c of message) {
    if (/[a-zA-Z]/.test(c)) {
      tokenCount += alphabeticTokenWeight;
    } else if (/\s/.test(c)) {
      if (remainingSpacesToIgnore > 0) {
        remainingSpacesToIgnore--;
        spaceCount -= 10;
      } else {
        tokenCount += 30;
      }
    } else {
      tokenCount += 30; // Non-alphabetic characters count as a full token
    }
  }

  return Math.floor(tokenCount / 30) + 1;
}

// SHA-256 hash function using Web Crypto API
async function hashString(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

class OpenAI extends BaseEngine {

  override async run(
    prompt: string,
    logger: FileManager | undefined,
    payloadHistory: OpenAIPayload | undefined,
    thinkingAbout?: string
  ): Promise<{ message: string, metadata: OpenAIPayload }> {
    const start = Date.now();
    let payload = payloadHistory ? this.addToOpenAIPayload(prompt, 'user', payloadHistory) : this.newOpenAIPayload(prompt);
    if (!OPEN_AI_KEY) {
      throw new Error("OPEN_AI_KEY is not set");
    }

    const tokenCount = countTokensFromMessageLlama3(JSON.stringify(payload));
    const contextMessage = thinkingAbout || this.thinkingAbout || "Processing";
    logger?.log(`[Thinking] AI Thinking About ${contextMessage} ${tokenCount}[tokens]`);
    const data = {
      url: `https://api.openai.com/v1/chat/completions`,
      method: "POST",
      data: payload,
      headers: {
        Authorization: `Bearer ${OPEN_AI_KEY}`,
      }
    };
    logger?.save(1000, `${new Date().toISOString()}-${tokenCount}`, JSON.stringify(payload, null, 2), 'json');

    const payloadString = JSON.stringify(payload, null, 2);
    const hashedFilename = (await hashString(payloadString)) + '-' + tokenCount + '.json';
    const cachedPayload = await logger?.loadCache(hashedFilename);
    let responseData: OpenAIResponse | null = null;
    if (cachedPayload) {
      logger?.log(`[Cache] Found cached payload ${hashedFilename}`);
      responseData = JSON.parse(cachedPayload);
    } else {
      const response = await axios<OpenAIResponse>(data);
      responseData = response.data;
      logger?.saveCache(hashedFilename, JSON.stringify(responseData, null, 2));
    }

    const end = Date.now();
    const time = end - start;
    // const prompt_short = prompt.substring(0, 50) + "..." + prompt.substring(prompt.length - 50);
    logger?.log(`[Thinking] AI took ${time}[ms] to process ${contextMessage}`);
    payload = this.addToOpenAIPayload(responseData!.choices[0].message.content, 'assistant', payload);
    return {
      message: responseData!.choices[0].message.content,
      metadata: payload
    };
  }


  private addToOpenAIPayload(prompt: string, role: OpenAIMessage['role'], payload: OpenAIPayload): OpenAIPayload {
    payload.messages.push({
      role: role,
      content: [{ type: 'text', text: prompt }],
      // content: prompt
    });
    return payload;
  }

  private newOpenAIPayload(prompt: string): OpenAIPayload {
    const payload: OpenAIPayload = {
      model: this.name,
      messages: [{
        role: 'developer',
        content:
          [{
            type: 'text',
            text:
              "You are a very helpful assistant. You may be provided with documents or content to analyze and answer questions about them, in that case refer to the content provided in the user message for your responses.",
          }],
      }],
      // stream: false,
    };
    return this.addToOpenAIPayload(prompt, 'user', payload);
  }
}

interface OpenAIMessage {
  role: 'developer' | 'user' | 'assistant';
  content: {
    type: 'text',
    text: string,
  }[];
}

interface OllamaPayload {
  model: string;
  messages: OllamaMessage[];
  options: {
    num_ctx: number;
  };
  stream: boolean;
}

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}



class OllamaEngine extends BaseEngine {
  override async run(
    prompt: string,
    logger: FileManager | undefined = undefined,
    payloadHistory: OllamaPayload | undefined = undefined,
    thinkingAbout?: string
  ): Promise<{ message: string, metadata: OllamaPayload }> {
    const start = Date.now();
    let payload = payloadHistory ? this.addToOllamaPayload(prompt, 'user', payloadHistory) : this.newOllamaPayload(prompt);
    if (!ollamaApiUrl) {
      throw new Error("OLLAMA_API_URL is not set");
    }

    const contextMessage = thinkingAbout || this.thinkingAbout || "Processing";
    logger?.log(`[Thinking] AI Thinking About ${contextMessage}`);

    const response = await axios({
      url: `${ollamaApiUrl}/api/chat`,
      method: "POST",
      data: JSON.stringify(payload),
    });
    const end = Date.now();

    const time = end - start;
    logger?.log(`[Thinking] Ollama took ${time}ms to process ${contextMessage}`.replace(/\n/g, " "));
    payload = this.addToOllamaPayload(response.data.message.content, 'assistant', payload);
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
      console.error(`Ollama is not running at ${ollamaApiUrl}`);
      return [];
    }
  }



  // Ollama specific methods\
  private addToOllamaPayload(prompt: string, role: OllamaMessage['role'], payload: OllamaPayload): OllamaPayload {
    payload.messages.push({
      "role": role,
      "content": prompt,
    });
    return payload;
  }

  private newOllamaPayload(prompt: string): OllamaPayload {
    const payload: OllamaPayload = {
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
    return this.addToOllamaPayload(prompt, 'user', payload);
  }
}




