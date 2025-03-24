import { OllamaEngine, OllamaPayload } from "./Ollama.ts";
import { OpenAI, OpenAIPayload } from "./OpenAI.ts";
import { PerplexityEngine, PerplexityPayload } from "./Perplexity.ts";

export type Payload = OllamaPayload | OpenAIPayload | PerplexityPayload;

export function getPerplexity() {
  return new PerplexityEngine("sonar-reasoning");
}

export function getLlama318bInstruct() {
  return new OllamaEngine("llama3.1:8b-instruct-q4_1");
}

export function getDeepSeekR132B() {
  return new OllamaEngine("deepseek-r1:32b");
}

export function getOpenAIO4Mini() {
  return new OpenAI("gpt-4o-mini");
}
export function getOpenAIO4() {
  return new OpenAI("gpt-4o");
}

export function countTokensFromMessageLlama3(message: string): number {
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
export async function hashString(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
