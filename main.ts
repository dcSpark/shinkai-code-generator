import {
  createDir,
  getInstalledModels,
  getToolImplementationPrompt,
} from "./helpers.ts";
import { executeTest } from "./test-exec.ts";
import { startTest } from "./test-llm.ts";
import { tests } from "./tests.ts";

const good = "✅";
const bad = "❌";
const warning = "⚠️";
const info = "ℹ️";
const question = "❓";
const skip = "⏩";

const mode = Deno.args[0];
let run_llm = false;
let run_exec = false;
switch (mode) {
  case "exec":
    run_exec = true;
    break;
  case "llm":
    try {
      if (await Deno.stat("./results")) {
        await Deno.remove("./results", { recursive: true });
      }
    } catch (_) { /* nop */ }
    run_llm = true;
    break;
  default:
    try {
      if (await Deno.stat("./results")) {
        await Deno.remove("./results", { recursive: true });
      }
    } catch (_) { /* nop */ }
    run_llm = true;
    run_exec = true;
}

const models = await getInstalledModels();

for (const model of models) {
  for (const test of tests) {
    console.log(`[Testing] ${test.code} @ ${model}`);

    if (run_llm) {
      await createDir(test.code, model);
      await getToolImplementationPrompt(test.code, model, test.tools);
      await startTest(test, model);
    }
    if (run_exec) {
      await executeTest(test, model);
    }
    const code = await checkIfExistsAndHasContent(
      `./results/${test.code}/${model}/src-code.ts`,
    );
    const metadata = await checkIfExistsAndHasContent(
      `./results/${test.code}/${model}/src-metadata.json`,
    );
    const execute = await checkIfExistsAndHasContent(
      `./results/${test.code}/${model}/execute-output`,
    );
    console.log(`    Code ${code ? good : bad}`);
    console.log(`    Metadata ${metadata ? good : bad}`);
    console.log(`    Execute ${execute ? good : bad}`);
    console.log(`    [Done] ${model} for ${test.code}`);
  }
}

async function checkIfExistsAndHasContent(path: string) {
  try {
    await Deno.stat(path);
    const content = await Deno.readTextFile(path);  
    return content.length > 0;
  } catch (_) {
    return false;
  }
}
