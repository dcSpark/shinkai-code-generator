import { TEST } from "./../tests.ts";
import { PromptTest, PromptTestResult } from "./PromptTest.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
export async function generateCodeAndMetadata(test: TEST, model: BaseEngine) {
  const start = Date.now();

  const data = await new PromptTest(
    test,
    model,
  ).run();
  console.log(
    `    [LLM] ${model.name} - Execution Time: ${Date.now() - start}ms`,
  );
  // Write Code
  await writeToFile(test, model, "code", data.code);
  // Write Metadata
  await writeToFile(
    test,
    model,
    "metadata",
    data.metadata ?? { prompt: "", raw: "", src: null },
  );
}

const writeToFile = async (
  test: TEST,
  model: BaseEngine,
  type: "code" | "metadata",
  data: PromptTestResult,
) => {
  await Deno.writeFile(
    `./results/${test.code}/${model.name}/prompt-${type}.md`,
    new TextEncoder().encode(data.prompt),
  );
  await Deno.writeFile(
    `./results/${test.code}/${model.name}/raw-response-${type}.md`,
    new TextEncoder().encode(data.raw),
  );
  await Deno.writeFile(
    `./results/${test.code}/${model.name}/src-${type}.${
      type === "code" ? "ts" : "json"
    }`,
    new TextEncoder().encode(data.src ?? ""),
  );
};
