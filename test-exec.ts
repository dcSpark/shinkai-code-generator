import { TEST } from "./tests.ts";

export async function executeTest(test: TEST, model: string) {
  try {
    const code = [
      `
    if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
    if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
    if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
    if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "${model}");
    `,
      await Deno.readTextFile(
        `./results/${test.code}/${model}/@shinkai/local-tools.ts`,
      ),
      (await Deno.readTextFile(
        `./results/${test.code}/${model}/src-code.ts`,
      )).replace(
        /import\s+{.*\s+from\s+['"]@shinkai\/local-tools['"];/g,
        "",
      ).replace(/import axios.*;/g, ""),
      `
  // console.log('Running...')
  // console.log('Config: ${JSON.stringify(test.config)}')
  // console.log('Inputs: ${JSON.stringify(test.inputs)}')
  console.log(
    await run(${JSON.stringify(test.config)}, ${JSON.stringify(test.inputs)})
  );
  `,
    ].join("\n");

    await Deno.writeTextFile(`./results/${test.code}/${model}/final-src-code.ts`, code);

    // console.log("================================================");
    // console.log(`Running ${test.code} @ ${model}`);
    // console.log("Code to execute: ");
    // console.log("...", code.substring(code.length - 1000, code.length - 1));
    // console.log("================================================");
    const command = new Deno.Command(Deno.execPath(), {
      args: ["eval", code],
      stdin: "piped",
      stdout: "piped",
    });

    const child = command.spawn();
    child.stdout.pipeTo(
      Deno.openSync(`./results/${test.code}/${model}/execute-output`, {
        write: true,
        create: true,
      }).writable,
    );

    // manually close stdin
    child.stdin.close();

    const _status = await child.status;
    console.log(`    [Executing] ${test.code} @ ${model}`);
    // console.log(`Wrote to ${`./results/${test.code}/${model}/execute-output`}`);
    const s = await child.status;
    // console.log(s);
    // console.log("================================================");
  } catch (e) {
    // console.log("ERROR", e);
  }
}
