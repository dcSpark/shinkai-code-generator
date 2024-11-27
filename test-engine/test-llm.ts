import { TestData } from "./../types.ts";
import { PromptTest, PromptTestResult } from "./PromptTest.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import path from "node:path";
import { Paths } from "../paths.ts";

export async function generateCodeAndMetadata(
  test: TestData,
  model: BaseEngine,
) {
  const start = Date.now();
  console.log(`    [LLM] Started execution`);
  const data = await new PromptTest(
    test,
    model,
  ).run();
  console.log(
    `    [LLM] ${model.path} - Execution Time: ${Date.now() - start}ms`,
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
  test: TestData,
  model: BaseEngine,
  type: "code" | "metadata",
  data: PromptTestResult,
) => {
  await Deno.writeFile(
    type === "code" ? Paths.promptCode(test, model) : Paths.promptMetadata(test, model),
    new TextEncoder().encode(data.prompt),
  );
  await Deno.writeFile(
    type === "code" ? Paths.rawResponseCode(test, model) : Paths.rawResponseMetadata(test, model),
    new TextEncoder().encode(data.raw),
  );
  await Deno.writeFile(
    type === "code" ? Paths.srcCode(test, model) : Paths.srcMetadata(test, model),
    new TextEncoder().encode(data.src ?? ""),
  );
};
