import { BaseEngine } from "./llm-engine/BaseEngine.ts";
import { getModels } from "./llm-engine/getModels.ts";
import { Paths } from "./paths.ts";
import { Language, TestData } from "./types.ts";
import { allTests } from "./../tests/index.ts";

export class CLI_OPTIONS {
  run_llm: boolean = false;
  run_exec: boolean = false;
  run_shinkai: boolean = false;
  languages: Language[] = [];
  tests_to_run: TestData[] = [];
  models: BaseEngine[] = [];
}

// CLI Config
export async function getConfig(): Promise<CLI_OPTIONS> {
  const args = Deno.args;
  const cli_options = new CLI_OPTIONS();

  if (args.includes("help") || args.includes("--help")) {
    console.log(`Usage: deno task start [options]`);
    console.log(`Options:`);
    console.log(`  --llm, --exec, --shinkai      Run the corresponding steps`);
    console.log(
      `  --python, --typescript        Run the corresponding language tests`,
    );
    console.log(`  --random=<number>             Run a random number of tests`);
    console.log(`  --test=<test_name>            Run a specific test`);
    console.log(
      `  --test=name-*                 Run all tests that match the name-* pattern`,
    );
    console.log(`  --help                        Show this help message`);
    Deno.exit(0);
  }

  const args_without_flags = args.map((arg) => arg.replace(/^--/, ""));

  // Models
  cli_options.models = await getModels();

  // Languages
  if (
    args_without_flags.includes("python") ||
    args_without_flags.includes("py")
  ) {
    cli_options.languages.push("python");
  }
  if (
    args_without_flags.includes("typescript") ||
    args_without_flags.includes("ts")
  ) {
    cli_options.languages.push("typescript");
  }
  if (cli_options.languages.length === 0) {
    cli_options.languages = ["python", "typescript"];
  }

  // Steps
  cli_options.run_llm = args_without_flags.includes("llm");
  cli_options.run_exec = args_without_flags.includes("exec");
  cli_options.run_shinkai = args_without_flags.includes("shinkai");
  if (
    !cli_options.run_llm && !cli_options.run_exec && !cli_options.run_shinkai
  ) {
    cli_options.run_llm = true;
    cli_options.run_exec = true;
    cli_options.run_shinkai = true;
  }

  // Tests
  const testsOptions: string[] = args_without_flags.filter((arg) =>
    arg.match(/test=/)
  );
  let testFilters: string[] = [];
  if (testsOptions.length > 0) {
    testFilters = testsOptions.map((test) => test.replace(/test=/, ""));
  }

  const randomArg = args_without_flags.find((arg) => arg.match(/random=\d+/));
  const random_count = randomArg
    ? parseInt(randomArg.replace(/random=/, ""))
    : null;

  if (testFilters.length > 0) {
    cli_options.tests_to_run = allTests.filter((test) => {
      for (const filter of testFilters) {
        return test.code.match(filter) ||
          (filter.includes("*") &&
            new RegExp(filter.replace("*", ".*")).test(test.code));
      }
    });
  } else {
    cli_options.tests_to_run = allTests;
  }

  if (random_count && random_count > 0) {
    cli_options.tests_to_run = [...cli_options.tests_to_run]
      .sort(() => Math.random() - 0.5)
      .slice(0, random_count);
  }

  // Clean up
  if (cli_options.run_shinkai) {
    try {
      if (await Deno.stat(Paths.executionDir("python"))) {
        await Deno.remove(Paths.executionDir("python"), { recursive: true });
      }
    } catch (_) { /* nop */ }
    try {
      if (await Deno.stat(Paths.executionDir("typescript"))) {
        await Deno.remove(Paths.executionDir("typescript"), {
          recursive: true,
        });
      }
    } catch (_) { /* nop */ }
  }
  return cli_options;
}
