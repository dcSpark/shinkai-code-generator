import { OllamaEngine } from "../llm-engine/OllamaEngine.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TestData } from "../types.ts";
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

export const createDir = async (test: TestData, model: BaseEngine) => {
  for (const dir of Paths.pathToCreate(test, model)) {
    await Deno.mkdir(dir, { recursive: true });
  }
};

export const writeToFile = async (
  test: TestData,
  model: BaseEngine,
  type: "code" | "metadata",
  data: PromptTestResult,
) => {
  await Deno.writeFile(
    type === "code"
      ? Paths.promptCode(test, model)
      : Paths.promptMetadata(test, model),
    new TextEncoder().encode(data.prompt),
  );
  await Deno.writeFile(
    type === "code"
      ? Paths.rawResponseCode(test, model)
      : Paths.rawResponseMetadata(test, model),
    new TextEncoder().encode(data.raw),
  );
  await Deno.writeFile(
    type === "code"
      ? Paths.srcCode(test, model)
      : Paths.srcMetadata(test, model),
    new TextEncoder().encode(data.src ?? ""),
  );
};
