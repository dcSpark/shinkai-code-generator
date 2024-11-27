import { OllamaEngine } from "./OllamaEngine.ts";

export abstract class BaseEngine {
  public readonly path: string;
  public readonly shinkaiName: string;
  constructor(public readonly name: string) {
    this.path = name.replaceAll(/[^a-zA-Z0-9]/g, "-");
    // TODO how to generate names correctly for shinkai?
    this.shinkaiName = `o_${name.replaceAll(/[^a-zA-Z0-9]/g, "_")}`;
    console.log({ name: this.shinkaiName, path: this.path });
  }

  abstract run(prompt: string): Promise<string>;

  // This should return an array of subclasses of BaseEngine instances, one per model.
  static getInstalledModels(): Promise<BaseEngine[]> {
    throw new Error("Implement this in the subclass");
  }
}

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
          throw new Error(
            `Model ${modelName} not found @ ` + JSON.stringify(models),
          );
        }
        models.push(new OllamaEngine(m));
      } // TODO: Add other model prefixes
      else throw new Error(`Unknown model prefix: ${prefix}`);
    }
    if (models.length === 0) throw new Error("No models found");
    return models;
  } catch (e) {
    console.log("Error", e);
    throw e;
  }
}
