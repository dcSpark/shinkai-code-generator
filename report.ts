import { BaseEngine } from "./llm-engine/BaseEngine.ts";
import { TestData } from "./types.ts";
import { Paths } from "./paths.ts";

enum STATUS {
  GOOD = "✅",
  BAD = "❌",
  WARNING = "⚠️",
  INFO = "ℹ️",
  QUESTION = "❓",
  SKIP = "⏩",
}

export async function report(
  test: TestData,
  model: BaseEngine,
): Promise<{ score: number; max: number }> {
  let score = 0;
  let max = 0;
  // Report Results
  const code = await checkIfExistsAndHasContent(
    Paths.srcCode(test, model),
    false,
  );
  const metadata = await checkIfExistsAndHasContent(
    Paths.srcMetadata(test, model),
    false,
  );
  const execute = await checkIfExistsAndHasContent(
    Paths.executeOutput(test, model),
    true,
  );

  console.log(`    ${code[0]} Code ${code[1]}`);
  console.log(`    ${metadata[0]} Metadata ${metadata[1]}`);
  console.log(`    ${execute[0]} Execute ${execute[1]}`);
  console.log(
    `    Path Source Code ${Paths.finalSrcCode(test, model)}`,
  );
  console.log(`    [Done] ${test.code} @ ${model.path}`);
  if (code[0] === STATUS.GOOD) score += 1;
  if (metadata[0] === STATUS.GOOD) score += 1;
  if (execute[0] === STATUS.GOOD) score += 3;
  max += 5;

  if (test.check) {
    const multiplier = 3;
    max += multiplier;

    if (execute[0] === STATUS.GOOD) {
      const check = test.check(
        await Deno.readTextFile(
          Paths.executeOutput(test, model),
        ),
      );
      score += check * multiplier;
      let status = STATUS.BAD;
      if (check >= 1) status = STATUS.GOOD;
      else if (check > 0) status = STATUS.WARNING;
      console.log(`    ${status} Check [0-1] ${check}`);
    } else {
      console.log(
        `    ${STATUS.BAD} Check [0-1] (cannot check failed execution)`,
      );
    }
  }

  return { score, max };
}

async function checkIfExistsAndHasContent(
  path: string,
  showContent: boolean = false,
): Promise<[STATUS, string]> {
  try {
    await Deno.stat(path);
    const content = await Deno.readTextFile(path);
    if (content.trim().length > 0) {
      if (content.startsWith("::ERROR::")) {
        return [STATUS.BAD, content.substring(0, 100).replace(/\n/g, " ")];
      }
      return [
        STATUS.GOOD,
        showContent ? content.substring(0, 100).replace(/\n/g, " ") : "",
      ];
    }
    return [STATUS.WARNING, ""];
  } catch (_) {
    return [STATUS.QUESTION, ""];
  }
}
