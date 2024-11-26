import { OllamaEngine } from "../llm-engine/OllamaEngine.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TEST } from "../tests.ts";

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

export const createDir = async (test: TEST, model: BaseEngine) => {
  await Deno.mkdir(`./results/${test.code}/${model.path}/raw-prompts`, {
    recursive: true,
  });
};
