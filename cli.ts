// CLI Config
export async function getConfig(): Promise<
  {
    run_llm: boolean;
    run_exec: boolean;
    run_shinkai: boolean;
    tests_to_run: string[];
  }
> {
  const args = Deno.args;

  let run_llm = args.includes("llm");
  let run_exec = args.includes("exec");
  let run_shinkai = args.includes("shinkai");
  if (!run_llm && !run_exec && !run_shinkai) {
    run_llm = true;
    run_exec = true;
    run_shinkai = true;
  }

  const tests = args.filter((arg) => arg.match(/test=/));
  let tests_to_run: string[] = [];
  if (tests.length > 0) {
    tests_to_run = tests.map((test) => test.replace(/test=/, ""));
  }

  if (run_shinkai) {
    try {
      if (await Deno.stat("./results")) {
        await Deno.remove("./results", { recursive: true });
      }
    } catch (_) { /* nop */ }
  }
  return { run_llm, run_exec, run_shinkai, tests_to_run };
}
