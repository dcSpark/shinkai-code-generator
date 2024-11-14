import { TEST } from "./tests.ts";
import { getModels, writeToFile } from "./helpers.ts";
import { PromptTest } from "./PromptTest.ts";
import { useModels } from "./main.ts";
export const startTest = async (test: TEST) => {
  const models = await getModels(useModels);

  for (const model of models) {
    const start = Date.now();
    console.log(`[Testing] ${test.code} @ ${model}`);

    const data = await new PromptTest(
      test.prompt,
      model,
    ).run();
    console.log(`    ExecutionTime: ${Date.now() - start}ms`);
    await writeToFile(test.code, model, "code", data.code);
    await writeToFile(
      test.code,
      model,
      "metadata",
      data.metadata ?? { prompt: "", raw: "", src: null },
    );
  }
};
