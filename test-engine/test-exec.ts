import { BaseEngine } from "../llm-engine/BaseEngine.ts";
import { TestData } from "../types.ts";

async function generateCode(
  test: TestData,
  model: BaseEngine,
): Promise<string> {
  return [
    `
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
}

export async function executeTest(test: TestData, model: BaseEngine) {
  const path = `./results/${
    test.id?.toString().padStart(5, "0")
  }-${test.code}/${model.path}/final-src-code.ts`;

  let exists = false;
  try {
    if (await Deno.stat(path)) exists = true;
  } catch (_) { /* ignore */ }

  try {
    let code: string;
    if (!exists) {
      code = await generateCode(test, model);
      await Deno.writeTextFile(
        path,
        code,
      );
    } else {
      code = await Deno.readTextFile(path);
    }

    // Execute Deno binary with the generated code
    const command = new Deno.Command(Deno.execPath(), {
      args: ["run", "--allow-all", path],
      stdin: "piped",
      stdout: "piped",
    });

    const child = command.spawn();
    child.stdout.pipeTo(
      Deno.openSync(
        `./results/${
          test.id?.toString().padStart(5, "0")
        }-${test.code}/${model.path}/execute-output`,
        {
          write: true,
          create: true,
        },
      ).writable,
    );

    // manually close stdin
    child.stdin.close();

    const _status = await child.status;
    console.log(`    [Exec] ${test.code} @ ${model.path}`);
    // console.log(`Wrote to ${`./results/${test.id?.toString().padStart(5, '0')}-${test.code}/${model.path}/execute-output`}`);
    const s = await child.status;
    // console.log(s);
    // console.log("================================================");
  } catch (e) {
    console.log("ERROR", e);
  }
}
