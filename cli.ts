// Config
// Run with all - to execute both llm and exec
// Run with llm - to execute only llm steps
// Run with exec - to execute only exec steps
export async function getConfig(): Promise<
  { run_llm: boolean; run_exec: boolean }
> {
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
    case "all":
    default:
      try {
        if (await Deno.stat("./results")) {
          await Deno.remove("./results", { recursive: true });
        }
      } catch (_) { /* nop */ }
      run_llm = true;
      run_exec = true;
  }
  return { run_llm, run_exec };
}
