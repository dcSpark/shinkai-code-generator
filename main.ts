import { executeTest } from "./test-exec.ts";
import { startTest } from "./test-llm.ts";
import { tests } from "./tests.ts";

// SETUP THE MODELS TO BE USED
export const useModels = [
  // "phi3:3.8b",
  "llama3:8b-instruct-q4_1",
];

switch (Deno.args[0]) {
  // deno task start
  case "llm":
    for (const test of tests) {
      await startTest(test);
    }
    break;
  // deno task execute
  case "execute":
    for (const test of tests) {
      for (const model of useModels) {
        executeTest(test, model);
      }
    }
    break;
}
