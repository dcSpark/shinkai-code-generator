import { createDir, getInstalledModels } from "./test-engine/test-helpers.ts";
import { executeTest } from "./test-engine/test-exec.ts";
import { generateCodeAndMetadata } from "./test-engine/test-llm.ts";
import { tests } from "./tests.ts";
import { report } from "./report.ts";
import { getConfig } from "./cli.ts";
import { getToolImplementationPrompt } from "./test-engine/shinkai-prompts.ts";

const { run_llm, run_exec, run_shinkai } = await getConfig();
const models = (await getInstalledModels()).filter(model => !model.name.startsWith("snowflake-arctic"));
console.log(`[Testing] ${models.length} models found`);
console.log(`List of models: ${models.map((m) => m.name).join(", ")}`);

const total = models.length * tests.length;
const start = Date.now();
let current = 1;
let score = 0;
let maxScore = 0;
for (const model of models) {
  for (const test of tests) {
    console.log("--------------------------------");
    console.log(`[Testing] ${current}/${total} ${test.code} @ ${model.name}`);
    console.log(`    [Prompt] ${test.prompt.substring(0, 100).replaceAll("\n", " ")}`);
    current += 1;
    
    if (run_shinkai) {
      await createDir(test, model);
      await getToolImplementationPrompt(test, model);
    }
    if (run_llm) {
      await generateCodeAndMetadata(test, model);
    }
    if (run_exec) {
      await executeTest(test, model);
      const { score: s, max } = await report(test, model);
      score += s;
      maxScore += max;
    }
  }
}
console.log(`[Done] Total Time: ${Date.now() - start}ms`);
if (run_exec) {
  console.log(`[Done] Total Score: ${score}/${maxScore}`);
}
