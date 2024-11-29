import { allTests } from "./tests/index.ts";
import { getConfig } from "./cli.ts";
import { getModels } from "./llm-engine/getModels.ts";
import { TestSteps } from "./test-engine/TestSteps.ts";

async function main() {
  const { run_llm, run_exec, run_shinkai, tests_to_run, random_count } =
    await getConfig();

  const models = await getModels();
  console.log(`[Testing] ${models.length} models found`);
  console.log(`List of models: ${models.map((m) => m.name).join(", ")}`);

  const start = Date.now();
  let score = 0;
  let maxScore = 0;
  let selectedTests = tests_to_run.length > 0
    ? allTests.filter((test) => {
      for (const test_to_run of tests_to_run) {
        if (test_to_run === "*") {
          const regex = new RegExp(test_to_run.replace("*", ".*"));
          if (regex.test(test.code)) return true;
        }
        if (test.code.match(test_to_run)) return true;
      }
      return false;
    })
    : allTests;

  if (random_count && random_count > 0) {
    selectedTests = [...selectedTests]
      .sort(() => Math.random() - 0.5)
      .slice(0, random_count);
  }

  TestSteps.total = models.length * selectedTests.length;

  for (const model of models) {
    for (const test of selectedTests) {
      test.id = TestSteps.current;
      const testSteps = new TestSteps(
        test,
        model,
        run_shinkai,
        run_llm,
        run_exec,
      );
      await testSteps.step_1();
      await testSteps.step_2();
      await testSteps.step_3();
      await testSteps.step_4();
      await testSteps.prepareEditor();
      const scores = testSteps.getScores();
      score += scores.score;
      maxScore += scores.maxScore;
    }
  }

  console.log(`[Done] Total Time: ${Date.now() - start}ms`);
  if (run_exec) {
    console.log(`[Done] Total Score: ${score}/${maxScore}`);
  }
}

main().then(() => {
  console.log("Done");
});
