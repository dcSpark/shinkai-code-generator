import { OllamaEngine } from "../llm-engine/OllamaEngine.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { Language, TestData } from "../types.ts";
import { Paths } from "../paths.ts";

import { PromptTestResult } from "./PromptTest.ts";

export async function getInstalledModels(): Promise<BaseEngine[]> {
  return [
    ...(await OllamaEngine.getInstalledModels()),
    // Add other engines here
    // ...(await GroqEngine.getInstalledModels()),
    // ...(await AnthropicEngine.getInstalledModels()),
    // ...(await OpenAIEngine.getInstalledModels()),
    // ...(await VertexAIEngine.getInstalledModels()),
    // ...(await AzureOpenAIEngine.getInstalledModels()),
    // ...(await CohereEngine.getInstalledModels()),
    // ...(await GeminiEngine.getInstalledModels()),
    // ...(await OpenRouterEngine.getInstalledModels()),
    // ...(await FireworksEngine.getInstalledModels()),
  ];
}

export const createDir = async (
  language: Language,
  test: TestData,
  model: BaseEngine,
) => {
  for (const dir of Paths.pathToCreate(language, test, model)) {
    await Deno.mkdir(dir, { recursive: true });
  }
};

export const writeToFile = async (
  language: Language,
  test: TestData,
  model: BaseEngine,
  type: "code" | "metadata",
  data: PromptTestResult,
) => {
  await Deno.writeFile(
    type === "code"
      ? Paths.promptCode(language, test, model)
      : Paths.promptMetadata(language, test, model),
    new TextEncoder().encode(data.prompt),
  );
  await Deno.writeFile(
    type === "code"
      ? Paths.rawResponseCode(language, test, model)
      : Paths.rawResponseMetadata(language, test, model),
    new TextEncoder().encode(data.raw),
  );
  await Deno.writeFile(
    type === "code"
      ? Paths.srcCode(language, test, model)
      : Paths.srcMetadata(language, test, model),
    new TextEncoder().encode(data.src ?? ""),
  );
};
