import axios from "npm:axios";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TestData } from "../types.ts";

const shinkaiApiUrl = Deno.env.get("SHINKAI_API_URL") ??
  "http://localhost:9950";

export async function getAllToolsHeaders(): Promise<string> {
  const response = await axios({
    method: "GET",
    url: `${shinkaiApiUrl}/v2/get_tool_implementation_prompt`,
    params: {
      language: "typescript",
    },
    headers: {
      Authorization: "Bearer debug",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  const { headers } = response.data;
  return headers;
}

export async function getToolImplementationPrompt(
  test: TestData,
  model: BaseEngine,
): Promise<void> {
  const response = await axios({
    method: "GET",
    url: `${shinkaiApiUrl}/v2/get_tool_implementation_prompt`,
    params: {
      language: "typescript",
      tools: test.tools.join(","),
    },
    headers: {
      Authorization: "Bearer debug",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  const { codePrompt, libraryCode, metadataPrompt } = response.data;

  await Deno.writeTextFile(
    `./results/${
      test.id?.toString().padStart(5, "0")
    }-${test.code}/${model.path}/shinkai-local-tools.ts`,
    libraryCode,
  );
  await Deno.writeTextFile(
    `./results/${
      test.id?.toString().padStart(5, "0")
    }-${test.code}/${model.path}/raw-prompts/create-metadata.md`,
    metadataPrompt,
  );
  await Deno.writeTextFile(
    `./results/${
      test.id?.toString().padStart(5, "0")
    }-${test.code}/${model.path}/raw-prompts/create-tool.md`,
    codePrompt,
  );
  console.log(
    `    [Shinkai] Fetched prompts & ${test.tools.length} tool${
      test.tools.length === 1 ? "" : "s"
    }`,
  );
}
