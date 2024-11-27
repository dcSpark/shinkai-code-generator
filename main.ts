import { createDir } from "./test-engine/test-helpers.ts";
import {
  checkCode,
  executeTest,
  generateCodeIfNotExists,
  tryToFixCode,
} from "./test-engine/test-exec.ts";
import { generateCodeAndMetadata } from "./test-engine/test-llm.ts";
import { allTests } from "./tests/index.ts";
import { report } from "./report.ts";
import { getConfig } from "./cli.ts";
import { getToolImplementationPrompt } from "./test-engine/shinkai-prompts.ts";
import { getModels } from "./llm-engine/BaseEngine.ts";

const { run_llm, run_exec, run_shinkai, tests_to_run, random_count } =
  await getConfig();

const models = await getModels();
console.log(`[Testing] ${models.length} models found`);
console.log(`List of models: ${models.map((m) => m.name).join(", ")}`);

const start = Date.now();
let current = 1;
let score = 0;
let maxScore = 0;
let selectedTests = tests_to_run.length > 0
  ? allTests.filter((test) => tests_to_run.includes(test.code))
  : allTests;

if (random_count && random_count > 0) {
  selectedTests = [...selectedTests]
    .sort(() => Math.random() - 0.5)
    .slice(0, random_count);
}
const total = models.length * selectedTests.length;

for (const model of models) {
  for (const test of selectedTests) {
    if (current % 4 === 0) test.sql_store = true;
    console.log(
      `[Test] ${current}/${total} ${test.code} @ ${model.path} ${
        test.sql_store ? "[SQL Added]" : ""
      }`,
    );
    current += 1;
  }
}

current = 1;
for (const model of models) {
  for (const test of selectedTests) {
    test.id = current;
    if (test.sql_store) {
      test.tools.push(
        "local:::rust_toolkit:::shinkai_sqlite_query_executor",
      );
    }

    console.log("--------------------------------");
    console.log(`[Testing] ${current}/${total} ${test.code} @ ${model.path}`);
    console.log(
      `    [Prompt] ${test.prompt.substring(0, 100).replaceAll("\n", " ")}...`,
    );
    current += 1;

    if (run_shinkai) {
      await createDir(test, model);
      await getToolImplementationPrompt(test, model);
    }
    if (run_llm) {
      await generateCodeAndMetadata(test, model);
    }
    if (run_exec) {
      await generateCodeIfNotExists(test, model);

      const errorPath = await checkCode(test, model);
      const errors = await Deno.readTextFile(errorPath);
      if (errors.length > 0) {
        if (errors.match(/^Check file:\/\/\/.+?\.ts\n$/)) {
          console.log(`    [No Errors]`);
        } else {
          console.log(
            `    [Error] ${
              errors.replace(/\n/g, " ").replace(/\s+/g, " ").substring(0, 100)
            }...`,
          );
          await tryToFixCode(test, model, errors);
        }
      }

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
