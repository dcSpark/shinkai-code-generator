import { BaseEngine } from "./llm-engine/BaseEngine.ts";
import { TEST } from "./tests.ts";

enum STATUS {
  GOOD = "✅",
  BAD = "❌",
  WARNING = "⚠️",
  INFO = "ℹ️",
  QUESTION = "❓",
  SKIP = "⏩",
}

export async function report(
  test: TEST,
  model: BaseEngine,
): Promise<{ score: number; max: number }> {
  let score = 0;
  // Report Results
  const code = await checkIfExistsAndHasContent(
    `./results/${test.code}/${model.name}/src-code.ts`,
  );
  const metadata = await checkIfExistsAndHasContent(
    `./results/${test.code}/${model.name}/src-metadata.json`,
  );
  const execute = await checkIfExistsAndHasContent(
    `./results/${test.code}/${model.name}/execute-output`,
  );
  console.log(`    ${code[0]} Code ${code[1]}`);
  console.log(`    ${metadata[0]} Metadata ${metadata[1]}`);
  console.log(`    ${execute[0]} Execute ${execute[1]}`);
  console.log(`    [Done] ${model.name} for ${test.code}`);
  if (code[0] === STATUS.GOOD) score += 1;
  if (metadata[0] === STATUS.GOOD) score += 1;
  if (execute[0] === STATUS.GOOD) score += 3;
  return { score, max: 5 };
}

async function checkIfExistsAndHasContent(
  path: string,
): Promise<[STATUS, string]> {
  try {
    await Deno.stat(path);
    const content = await Deno.readTextFile(path);
    if (content.trim().length > 0) {
      if (content.startsWith("::ERROR::")) {
        return [STATUS.BAD, content.substring(0, 100).replace(/\n/g, " ")];
      }
      return [STATUS.GOOD, ""];
    }
    return [STATUS.WARNING, ""];
  } catch (_) {
    return [STATUS.QUESTION, ""];
  }
}
