import { PromptTestResult } from "./PromptTest.ts";
import axios from "npm:axios";

const apiUrl = Deno.env.get("OLLAMA_API_URL") ?? "http://localhost:11434";

export const writeToFile = async (
  code: string,
  model: string,
  type: "code" | "metadata",
  data: PromptTestResult,
) => {
  await Deno.mkdir(`./results/${code}/${model}`, { recursive: true });
  await Deno.writeFile(
    `./results/${code}/${model}/prompt-${type}.md`,
    new TextEncoder().encode(data.prompt),
  );
  await Deno.writeFile(
    `./results/${code}/${model}/raw-response-${type}.md`,
    new TextEncoder().encode(data.raw),
  );
  await Deno.writeFile(
    `./results/${code}/${model}/src-${type}.${type === "code" ? "ts" : "json"}`,
    new TextEncoder().encode(data.src ?? ""),
  );
};

export const getModels = async (okModels: string[]): Promise<string[]> => {
  const response = await axios.get<{ models: { name: string }[] }>(
    `${apiUrl}/api/tags`,
  );
  const models = response.data.models.map((model) => model.name);
  return models.filter((model) => okModels.includes(model));
};
