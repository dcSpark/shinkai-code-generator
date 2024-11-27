import { OllamaEngine } from "../llm-engine/OllamaEngine.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TestData } from "../types.ts";
import path from "node:path";
import { Paths } from "../paths.ts";

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
  await Deno.mkdir(
    path.join(Paths.getBasePath(test, model)),
    { recursive: true },
  );
};
