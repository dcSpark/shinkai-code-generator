import { GetPythonToolImplementationPromptResponse, GetTypescriptToolImplementationPromptResponse, ShinkaiAPI } from "./ShinkaiAPI.ts";
import { Language } from "./types.ts";

// Wrapper to merge system prompts
export async function getFullHeadersAndTools(code: string = ""): Promise<{
  availableTools: string[],
  typescript: GetTypescriptToolImplementationPromptResponse,
  python: GetPythonToolImplementationPromptResponse
}> {
  const api = new ShinkaiAPI();
  const fetch_tools = await api.getTypescriptToolImplementationPrompt();
  const { availableTools } = fetch_tools;

  const typescript_full = await api.getTypescriptToolImplementationPrompt(availableTools, code);
  const python_full = await api.getPythonToolImplementationPrompt(availableTools, code);
  return {
    availableTools,
    typescript: typescript_full,
    python: python_full,
  }
}

// Get partial tools
export async function getInternalTools(language: Language, tools: string[] = []): Promise<{
  tools: string,
}> {
  const api = new ShinkaiAPI();
  const typescript_full = await api.getTypescriptToolImplementationPrompt(tools, "");
  const python_full = await api.getPythonToolImplementationPrompt(tools, "");

  const external_tools = language === 'typescript' ?
    typescript_full.headers["shinkai-local-tools"] :
    python_full.headers["shinkai_local_tools"];
  const internal_tools = language === 'typescript' ?
    typescript_full.headers["shinkai-local-support"] :
    python_full.headers["shinkai_local_support"];

  return {
    tools: internal_tools + '\n' + external_tools,
  }
}
