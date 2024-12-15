import { BaseEngine } from "./BaseEngine.ts";
import { OllamaEngine } from "./OllamaEngine.ts";
import { TogetherEngine } from "./TogetherEngine.ts";

export async function getModels(): Promise<BaseEngine[]> {
  try {
    const data = await Deno.readTextFile("models.txt");
    const lines = data.split("\n").filter((line) => line.trim() !== "");
    const models: BaseEngine[] = [];
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const [prefix, ...modelParts] = line.split(":");
      const modelName = modelParts.join(":");
      if (prefix === "ollama") {
        const availableModels = await OllamaEngine.fetchModels();
        const m = availableModels.find((m) => m === modelName);
        if (!m) {
          throw new Error(`Model ${modelName} not found @ ` + JSON.stringify(models));
        }
        models.push(new OllamaEngine(m));
      } else if (prefix === "together") {
        models.push(new TogetherEngine(modelName));
      } else {
        throw new Error(`Unknown model prefix: ${prefix}`);
      }
    }
    if (models.length === 0) throw new Error("No models found");
    return models;
  } catch (e) {
    console.log("Error", e);
    throw e;
  }
}
