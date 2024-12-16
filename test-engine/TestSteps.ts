import { Language, TestData } from "../types.ts";
import { PromptTest } from "./PromptTest.ts";
import { getToolImplementationPrompt } from "./shinkai-prompts.ts";
import { Paths } from "../paths.ts";
import { executeCode, resolveShinkaiFile, save_tool } from "./shinak-api.ts";
import { writeToFile } from "./test-helpers.ts";
// import { appendAditionalCode, checkIfHeadersPresent } from "./test-exec.ts";
import { BaseEngine } from "../llm-engine/BaseEngine.ts";
// import { checkCode, executeTest, 
// import {tryToFixCode } from "./test-exec.ts";
import { createDir } from "./test-helpers.ts";
import { report } from "../report.ts";

export class TestSteps {
  static current = 1;
  public static total = 0;
  private score = 0;
  private maxScore = 0;

  constructor(
    private test: TestData,
    private language: Language,
    private model: BaseEngine,
    private run_shinkai: boolean,
    private run_llm: boolean,
    private run_exec: boolean,
  ) {
    console.log("--------------------------------");
    console.log(
      `[Testing] ${TestSteps.current}/${TestSteps.total} ${this.test.code} @ ${this.model.path}`,
    );
    TestSteps.current += 1;
  }

  // Step 1:
  // - Initial setup and Shinkai execution
  // - Create directory
  // - Fetch other shinkai-tools
  // - Fetch Raw Prompts from node
  async step_1() {
    if (!this.run_shinkai) return;

    console.log(
      `    [Prompt] ${
        this.test.prompt.substring(0, 100).replaceAll("\n", " ")
      }...`,
    );
    await createDir(this.language, this.test, this.model);
    await getToolImplementationPrompt(this.language, this.test, "", this.model);
  }

  // Step 2:
  // - Run metadata augmentation
  // - Run tools selection
  // - Generate Code
  // - Check for syntax errors
  // - Try to fix errors?
  // - Write final code
  async step_2() {
    if (!this.run_llm) return;

    const start = Date.now();
    console.log(`    [LLM] Started execution`);
    const data = await new PromptTest(
      this.language,
      this.test,
      this.model,
    ).startCodeGeneration();
    console.log(
      `    [LLM] ${this.model.path} - Execution Time: ${Date.now() - start}ms`,
    );

    // Write Code
    await writeToFile(this.language, this.test, this.model, "code", data.code);

    // Try to fix errors
    // const errorPath = await checkCode(this.language, this.test, this.model);
    // const errors = await Deno.readTextFile(errorPath);
    // if (errors.length > 0) {
    //   if (errors.match(/^Check file:\/\/\/.+?\.ts\n$/)) {
    //     console.log(`    [No Errors]`);
    //     await Deno.writeTextFile(
    //       Paths.finalSrcCode(this.language, this.test, this.model),
    //       await Deno.readTextFile(
    //         Paths.srcCode(this.language, this.test, this.model),
    //       ),
    //     );
    //   } else {
    //     console.log(
    //       `    [Error] ${
    //         errors.replace(/\n/g, " ").replace(/\s+/g, " ").substring(0, 100)
    //       }...`,
    //     );
    //     await tryToFixCode(this.language, this.test, this.model, errors);
    //   }
    // } else {
    await Deno.writeTextFile(
      Paths.finalSrcCode(this.language, this.test, this.model),
      await Deno.readTextFile(
        Paths.srcCode(this.language, this.test, this.model),
      ),
    );
    // }
    const code = await Deno.readTextFile(
      Paths.finalSrcCode(this.language, this.test, this.model),
    );
    await getToolImplementationPrompt(this.language, this.test, code, this.model);

  }

  // Step 3:
  // - Generate Metadata with LLM
  async step_3() {
    if (!this.run_llm) return;

    const metadata = await new PromptTest(
      this.language,
      this.test,
      this.model,
    ).startMetadataGeneration(
      await Deno.readTextFile(
        Paths.finalSrcCode(this.language, this.test, this.model),
      ),
    );

    await writeToFile(
      this.language,
      this.test,
      this.model,
      "metadata",
      metadata.metadata ?? { prompt: "", raw: "", src: null },
    );
  }

  // Step 4:
  // - Patch code (add env)
  // - Run code with Deno
  // - Save tool in node
  // - Report results
  async step_4() {
    if (!this.run_exec) return;

    await Deno.readTextFile(
      Paths.finalSrcCode(this.language, this.test, this.model),
    );
    
    // await executeTest(this.language, this.test, this.model);
    const shinkaiExecution = await executeCode({
      code: await Deno.readTextFile(
        Paths.finalSrcCode(this.language, this.test, this.model),
      ),
      toolType: this.language === 'typescript' ? 'denodynamic' : 'pythondynamic',
      llmProvider: this.model.shinkaiName,
      tools: this.test.tools,
      parameters: this.test.inputs,
    });

    if (shinkaiExecution.error) {
      console.log(`    [Error] ${shinkaiExecution.error.substring(0, 100)}...`);
      Deno.writeTextFile(
        Paths.executeErrorOutput(this.language, this.test, this.model),
        shinkaiExecution.error,
      );
    } else {
        console.log(`    [Success]`);   
        // download files
        if (shinkaiExecution?.data?.__created_files__) {
          for (const file of shinkaiExecution.data.__created_files__) {
            await resolveShinkaiFile({ fileUrl: file, folder: Paths.editorAssetsPath(this.language, this.test, this.model) });
            console.log(`    [Download] ${file}`);
          }
        }
      

      console.log(JSON.stringify(shinkaiExecution.data).substring(0, 100) + '...');
      Deno.writeTextFile(
        Paths.executeOutput(this.language, this.test, this.model),
        JSON.stringify(shinkaiExecution.data ?? {}, null, 2),
      );

      if (this.test.save) {
        console.log(
          "    [Save]",
          await save_tool(this.language, this.test, this.model),
        );
      }
    }
    const { score: s, max } = await report(
      this.language,
      this.test,
      this.model,
    );
    this.score += s;
    this.maxScore += max;
  }

  async prepareEditor() {
    console.log(
      `    [Editor] run > \`code ${
        Paths.editorBasePath(this.language, this.test, this.model)
      }\``,
    );
  }

  getScores() {
    return {
      score: this.score,
      maxScore: this.maxScore,
    };
  }
}
