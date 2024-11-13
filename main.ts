import axios from "npm:axios";
import { PromptTest, PromptTestResult } from "./PromptTest.ts";

type TEST = { code: string, prompt: string };

const apiUrl = Deno.env.get("OLLAMA_API_URL") ?? "http://localhost:11434";

const getModels = async (): Promise<string[]> => {
  const response = await axios.get<{ models: { name: string }[] }>(`${apiUrl}/api/tags`);
  const models = response.data.models.map((model) => model.name);
  
  return models.filter(model => {
    switch (model) {
      case "phi3:3.8b":
      case "llama3:8b-instruct-q4_1":
        return true;
      default:
        console.log(`[Skipping] ${model}`);
        return false;
    }
  });
};

const writeToFile = async (code: string, model: string, type: "code" | "metadata", data: PromptTestResult) => {
  await Deno.mkdir(`./results/${code}/${model}`, { recursive: true });
  await Deno.writeFile(`./results/${code}/${model}/prompt-${type}.md`, new TextEncoder().encode(data.prompt));
  await Deno.writeFile(`./results/${code}/${model}/raw-response-${type}.md`, new TextEncoder().encode(data.raw));
  await Deno.writeFile(`./results/${code}/${model}/src-${type}.${type === "code" ? "ts" : "json"}`, new TextEncoder().encode(data.src ?? ''));
};

const startTest = async (test: TEST) => {
  const models = await getModels();

  for (const model of models) {
    const start = Date.now();
    console.log(`[Testing] ${test.code} @ ${model}`);

    const data = await new PromptTest(
      test.prompt,
      model,
    ).run();
    console.log(`    ExecutionTime: ${Date.now() - start}ms`);
    await writeToFile(test.code, model, "code", data.code);
    await writeToFile(test.code, model, "metadata", data.metadata ?? { prompt: "", raw: "", src: null });
  }
};

const tests: TEST[] = [{
  code: 'download-url',
  prompt: 'Generate a tool that downloads urls and converts them to plain text',
}, {
  code: 'download-table',
  prompt: 'Generate a tool that downloads urls and summarizes them and make a table',
}];

for (const test of tests) {
  await startTest(test);
}
