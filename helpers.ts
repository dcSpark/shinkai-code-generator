import { PromptTestResult } from "./PromptTest.ts";
import axios from "npm:axios";

const ollamaApiUrl = Deno.env.get("OLLAMA_API_URL") ?? "http://localhost:11434";
const shinkaiApiUrl = Deno.env.get("SHINKAI_API_URL") ??
  "http://localhost:9950";

export async function getInstalledModels(): Promise<string[]> {
  const response = await axios({
    method: "GET",
    url: `${ollamaApiUrl}/api/tags`,
  });
  return response.data.models.map((m: { model: unknown }) => m.model);
}

export async function getToolImplementationPrompt(
  code: string,
  model: string,
  tools: string[],
): Promise<void> {
  const response = await axios({
    method: "GET",
    url: `${shinkaiApiUrl}/v2/get_tool_implementation_prompt`,
    params: {
      language: "typescript",
      tools: tools.join(","),
    },
    headers: {
      Authorization: "Bearer debug",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  const { codePrompt, libraryCode, metadataPrompt } = response.data;

  await Deno.writeTextFile(
    `./results/${code}/${model}/@shinkai/local-tools.ts`,
    libraryCode,
  );
  await Deno.writeTextFile(
    `./results/${code}/${model}/raw-prompts/create-metadata.md`,
    metadataPrompt,
  );
  await Deno.writeTextFile(
    `./results/${code}/${model}/raw-prompts/create-tool.md`,
    codePrompt,
  );
}

export const createDir = async (code: string, model: string) => {
  await Deno.mkdir(`./results/${code}/${model}/raw-prompts`, {
    recursive: true,
  });
  await Deno.mkdir(`./results/${code}/${model}/@shinkai`, { recursive: true });
};

export const writeToFile = async (
  code: string,
  model: string,
  type: "code" | "metadata",
  data: PromptTestResult,
) => {
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

// export const getModels = async (okModels: string[]): Promise<string[]> => {
//   const response = await axios.get<{ models: { name: string }[] }>(
//     `${apiUrl}/api/tags`,
//   );
//   const models = response.data.models.map((model) => model.name);
//   return models.filter((model) => okModels.includes(model));
// };
