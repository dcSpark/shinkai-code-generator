
// CLI Config
export async function getConfig(): Promise<
  { run_llm: boolean; run_exec: boolean; run_shinkai: boolean }
> {
  const args = Deno.args;

  const run_llm = args.includes("llm") || args.length === 0;
  const run_exec = args.includes("exec") || args.length === 0;
  const run_shinkai = args.includes("shinkai") || args.length === 0;

  if (run_shinkai) {
    try {
      if (await Deno.stat("./results")) {
        await Deno.remove("./results", { recursive: true });
      }
    } catch (_) { /* nop */ }
  }
  return { run_llm, run_exec, run_shinkai };
}
