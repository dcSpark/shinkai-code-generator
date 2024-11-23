import axios from "npm:axios";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TEST } from "../tests.ts";

const shinkaiApiUrl = Deno.env.get("SHINKAI_API_URL") ??
  "http://localhost:9950";

export async function getToolImplementationPrompt(
  test: TEST,
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
    `./results/${test.code}/${model.name}/@shinkai/local-tools.ts`,
    libraryCode,
  );
  await Deno.writeTextFile(
    `./results/${test.code}/${model.name}/raw-prompts/create-metadata.md`,
    metadataPrompt,
  );
  await Deno.writeTextFile(
    `./results/${test.code}/${model.name}/raw-prompts/create-tool.md`,
    codePrompt,
  );
}
