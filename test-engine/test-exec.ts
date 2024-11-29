import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TestData } from "../types.ts";
import { PromptTest } from "./PromptTest.ts";
import { Paths } from "./../paths.ts";

export function checkIfHeadersPresent(code: string) {
  return code.includes("SHINKAI_NODE_LOCATION") &&
    code.includes("BEARER") &&
    code.includes("X_SHINKAI_TOOL_ID") &&
    code.includes("X_SHINKAI_APP_ID") &&
    code.includes("X_SHINKAI_LLM_PROVIDER");
}

export function appendAditionalCode(
  code_: string,
  test: TestData,
  model: BaseEngine,
) {
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
    code_,
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
  return code;
}

export async function executeTest(
  test: TestData,
  model: BaseEngine,
): Promise<string> {
  // Execute Deno binary with the generated code
  const outputPath = Paths.executeOutput(test, model);
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", Paths.finalSrcCode(test, model)],
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
  const outputPath = Paths.executeCheck(test, model);
  const command = new Deno.Command(Deno.execPath(), {
    args: ["check", Paths.srcCode(test, model)],
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
  console.log(`    [Check]`);
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
    Paths.shinkaiLocalTools(test, model),
    Paths.srcCode(test, model),
  ]);
  // Write the raw prompt and the raw fixed code
  await Deno.writeTextFile(
    Paths.tryFixCode(test, model),
    prompt,
  );
  if (code) {
    // Copy previous code
    await Deno.writeTextFile(
      Paths.originalCode(test, model),
      await Deno.readTextFile(Paths.srcCode(test, model)),
    );

    // Write the fixed code

    await Deno.writeTextFile(
      Paths.finalSrcCode(test, model),
      code,
    );
  }
  await Deno.writeTextFile(
    Paths.rawFixedCode(test, model),
    raw,
  );
}
