import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TestData } from "../types.ts";
import { PromptTest } from "./PromptTest.ts";

function generateCodePath(test: TestData, model: BaseEngine) {
  return `./results/${
    test.id?.toString().padStart(5, "0")
  }-${test.code}/${model.path}/final-src-code.ts`;
}

export async function generateCodeIfNotExists(
  test: TestData,
  model: BaseEngine,
): Promise<string> {
  try {
    if (await Deno.stat(generateCodePath(test, model))) {
      return generateCodePath(test, model);
    }
  } catch (_) { /* ignore */ }

  const code = [
    `
  // These environment variables are required, before any import.
  // Do not remove them, as they set environment variables for the Shinkai Tools.
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "${model.shinkaiName}");
  `,
    await Deno.readTextFile(
      `./results/${
        test.id?.toString().padStart(5, "0")
      }-${test.code}/${model.path}/src-code.ts`,
    ),
    `
  
  // console.log('Running...')
  // console.log('Config: ${JSON.stringify(test.config)}')
  // console.log('Inputs: ${JSON.stringify(test.inputs)}')
  
  try {
    const program_result = await run(${JSON.stringify(test.config)}, ${
      JSON.stringify(test.inputs)
    });
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

`,
  ].join("\n");

  await Deno.writeTextFile(
    generateCodePath(test, model),
    code,
  );
  return generateCodePath(test, model);
}

export async function executeTest(
  test: TestData,
  model: BaseEngine,
): Promise<string> {
  // Execute Deno binary with the generated code
  const outputPath = `./results/${
    test.id?.toString().padStart(5, "0")
  }-${test.code}/${model.path}/execute-output`;
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", generateCodePath(test, model)],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });

  const child = command.spawn();
  child.stderr.pipeTo(
    Deno.openSync(
      outputPath,
      {
        write: true,
        create: true,
      },
    ).writable,
  );

  child.stdout.pipeTo(
    Deno.openSync(outputPath, {
      write: true,
      create: true,
    }).writable,
  );

  child.stdin.close();

  const _status = await child.status;
  console.log(`    [Exec] ${test.code} @ ${model.path}`);
  const _s = await child.status;
  return outputPath;
}

export async function checkCode(test: TestData, model: BaseEngine) {
  const outputPath = `./results/${
    test.id?.toString().padStart(5, "0")
  }-${test.code}/${model.path}/execute-check`;
  const command = new Deno.Command(Deno.execPath(), {
    args: ["check", generateCodePath(test, model)],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });

  const child = command.spawn();
  child.stderr.pipeTo(
    Deno.openSync(outputPath, {
      write: true,
      create: true,
    }).writable,
  );

  child.stdout.pipeTo(
    Deno.openSync(outputPath, {
      write: true,
      create: true,
    }).writable,
  );

  child.stdin.close();

  const _status = await child.status;
  console.log(`    [Check] ${test.code} @ ${model.path}`);
  const _s = await child.status;

  return outputPath;
}

export async function tryToFixCode(
  test: TestData,
  model: BaseEngine,
  errors: string,
) {
  const promptTest = new PromptTest(test, model);
  console.log(`    [Fixing Code]`);
  const { code, raw, prompt } = await promptTest.fixCode(errors, [
    `./results/${
      test.id?.toString().padStart(5, "0")
    }-${test.code}/${model.path}/shinkai-local-tools.ts`,
    generateCodePath(test, model),
  ]);
  // Write the raw prompt and the raw fixed code
  await Deno.writeTextFile(
    `./results/${
      test.id?.toString().padStart(5, "0")
    }-${test.code}/${model.path}/raw-prompts/try-fix-code.md`,
    prompt,
  );
  await Deno.writeTextFile(
    `./results/${
      test.id?.toString().padStart(5, "0")
    }-${test.code}/${model.path}/raw-fixed-code.md`,
    raw,
  );

  if (code) {
    await Deno.writeTextFile(
      `./results/${
        test.id?.toString().padStart(5, "0")
      }-${test.code}/${model.path}/fixed-code.ts`,
      code,
    );
  }
}
