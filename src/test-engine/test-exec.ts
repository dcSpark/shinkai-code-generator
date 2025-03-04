import { BaseEngine } from "../support/llm-engine/BaseEngine.ts";
import { Language, TestData } from "../support/types.ts";
import { PromptTest } from "./PromptTest.ts";
import { Paths } from "./../support/paths.ts";

export async function tryToFixCode(
  language: Language,
  test: TestData,
  model: BaseEngine,
  errors: string,
) {
  const promptTest = new PromptTest(language, test, model);
  console.log(`    [Fixing Code]`);
  const { code, raw, prompt } = await promptTest.fixCode(errors, [
    ...(test.supportFiles?.map((f) => f.path) ?? []),
    Paths.srcCode(language, test, model),
  ]);
  // Write the raw prompt and the raw fixed code
  await Deno.writeTextFile(
    Paths.tryFixCode(language, test, model),
    prompt,
  );
  if (code) {
    // Copy previous code
    await Deno.writeTextFile(
      Paths.originalCode(language, test, model),
      await Deno.readTextFile(Paths.srcCode(language, test, model)),
    );

    // Write the fixed code

    await Deno.writeTextFile(
      Paths.finalSrcCode(language, test, model),
      code,
    );
  }
  await Deno.writeTextFile(
    Paths.rawFixedCode(language, test, model),
    raw,
  );
}
