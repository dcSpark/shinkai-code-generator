import { TEST } from "./tests.ts";

export async function executeTest(test: TEST, model: string) {
  const code = [(await Deno.readTextFile(
    `./results/${test.code}/${model}/src-code.ts`,
  )).replace(
    /import\s+{.*\s+from\s+['"]@shinkai\/local-tools['"];/,
    await Deno.readTextFile("./@shinkai/local-tools.ts"),
  ), `
  console.log('Running...')
  console.log('Config: ${JSON.stringify(test.config)}')
  console.log('Inputs: ${JSON.stringify(test.inputs)}')
  console.log(
    await run(${JSON.stringify(test.config)}, ${JSON.stringify(test.inputs)})
  );
  `].join('\n');

  console.log("================================================");
  console.log("Code to execute: ");
  console.log(code);
  console.log("================================================");
  const command = new Deno.Command(Deno.execPath(), {
    args: ["eval", code],
    stdin: "inherit",
    stdout: "inherit",
  });
  const child = command.spawn();

  const _status = await child.status;
  console.log(`[Executing] ${test.code} @ ${model}`);
  const s = await child.status;
  console.log(s);
}
