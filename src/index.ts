import { getConfig } from "./support/cli.ts";
import { TestSteps } from "./test-engine/TestSteps.ts";

async function main() {
  const config = await getConfig();

  console.log(`[Config] ${config.languages.join(", ")}`);
  console.log(`[Models] ${config.models.map((m) => m.name).join(", ")}`);
  console.log(`[Tests] ${config.tests_to_run.length} tests to run`);

  const start = Date.now();
  let score = 0;
  let maxScore = 0;
  TestSteps.total = config.languages.length * config.models.length *
    config.tests_to_run.length;

  for (const language of config.languages) {
    for (const model of config.models) {
      for (const test of config.tests_to_run) {
        // Skip test if it is limited to a different language
        if (test.limited_language && test.limited_language !== language) {
          console.log(`[Skip] ${test.code} is limited to ${test.limited_language} and not ${language}`);
          continue;
        }
        if (test.skip) {
          console.log(`[Skip] ${test.code} is skipped because ${test.skip}`);
          continue;
        }
        test.id = TestSteps.current;
        const testSteps = new TestSteps(
          test,
          language,
          model,
          config.run_shinkai,
          config.run_llm,
          config.run_exec,
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
    if (config.run_exec) {
      console.log(`[Done] Total Score: ${score}/${maxScore}`);
    }
  }
}

main().then(() => {
  console.log("Done");
});
