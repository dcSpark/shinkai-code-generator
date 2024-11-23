import { TEST } from "./tests.ts";
import { writeToFile } from "./helpers.ts";
import { PromptTest } from "./PromptTest.ts";

export async function startTest(test: TEST, model: string) {
  const start = Date.now();

  const data = await new PromptTest(
    test,
    model,
  ).run();
  console.log(`    [LLM ExecutionTime] ${model} : ${Date.now() - start}ms`);
  await writeToFile(test.code, model, "code", data.code);
  await writeToFile(
    test.code,
    model,
    "metadata",
    data.metadata ?? { prompt: "", raw: "", src: null },
  );
};
