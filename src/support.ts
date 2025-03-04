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

export function tryToExtractTS(text: string): string | null {
  const regex = text.match(/```typescript/) ?
    /```typescript\n([\s\S]+?)\n```/ :
    /```(?:typescript)?\n([\s\S]+?)\n```/;
  const match = text.match(regex);
  if (match) return match[1];
  return text;
}

export function tryToExtractPython(text: string): string | null {
  const regex = text.match(/```python/) ?
    /```python\n([\s\S]+?)\n```/ :
    /```(?:python)?\n([\s\S]+?)\n```/;
  const match = text.match(regex);
  if (match) return match[1];
  return text;
}

export function tryToExtractJSON(text: string): string | null {
  const regex = text.match(/```json/) ?
    /```json\n([\s\S]+?)\n```/ :
    /```(?:json)?\n([\s\S]+?)\n```/;
  const match = text.match(regex);
  if (match) return match[1];
  return text;
}

export function tryToExtractMarkdown(text: string): string | null {
  const regex = text.match(/```markdown/) ?
    /```markdown\n([\s\S]+?)\n```/ :
    /```(?:markdown)?\n([\s\S]+?)\n```/;
  const match = text.match(regex);
  if (match) return match[1];
  return text;
}