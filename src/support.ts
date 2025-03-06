import { GetTypescriptToolImplementationPromptResponse, GetPythonToolImplementationPromptResponse, ShinkaiAPI } from "./ShinkaiAPI.ts";

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
