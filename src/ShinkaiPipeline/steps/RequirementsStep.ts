import { FileManager } from "../FileManager.ts";
import { BasePipelineStep } from "./BasePipelineStep.ts";
import { IPipelineStepResult } from "../interfaces/IPipelineStep.ts";
import { BaseEngine, Payload } from "../llm-engines.ts";
import { LLMFormatter } from "../LLMFormatter.ts";
import { Language } from "../types.ts";

export class RequirementsStep extends BasePipelineStep {
  constructor(
    private language: Language,
    private prompt: string,
    private llmModel: BaseEngine,
    private llmFormatter: LLMFormatter,
    private toolType: 'shinkai' | 'mcp',
    private headers: string
  ) {
    super();
  }
  
  async execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult> {
    const cacheResult = await this.loadFromCache(stepNumber, fileManager, 'requirements', 'md');
    if (cacheResult.success) {
      return cacheResult;
    }
    
    try {
      fileManager.log(`[Planning Step ${stepNumber}] System Requirements & Feedback Prompt`, true);
      
      let user_prompt = this.prompt;
      if (this.toolType === 'mcp') {
        user_prompt += "\n\nNo matter what was said before, the \"Internal Libraries\" section is always NONE.";
      }
      
      const prompt = (await this.envService.readTextFile(this.envService.getCwd() + '/prompts/1-initial-requirements.md'))
        .replace('<input_command>\n\n</input_command>', `<input_command>\n${user_prompt}\n\n</input_command>`)
        .replace(/\{LANGUAGE\}/g, this.language)
        .replace(/\{RUNTIME\}/g, this.language === 'typescript' ? 'Deno' : 'Python')
        .replace("<internal-libraries>\n\n</internal-libraries>", `<internal-libraries>\n${this.headers}\n</internal-libraries>`);
      
      await fileManager.save(stepNumber, 'a', prompt, 'requirements-prompt.md');
      
      const parsedLLMResponse = await this.llmFormatter.retryUntilSuccess(async () => {
        const llmResponse = await this.llmModel.run(prompt, fileManager, undefined, "Analyzing Requirements & Generating Feedback");
        await fileManager.save(stepNumber, 'b', llmResponse.message, 'raw-requirements-response.md');
        return llmResponse.message;
      }, 'markdown', {
        regex: [
          new RegExp("# Requirements"),
          new RegExp("# Standard Libraries"),
          new RegExp("# Internal Libraries"),
          new RegExp("# External Libraries"),
          new RegExp("# Example Input and Output"),
        ]
      });
      
      await fileManager.save(stepNumber, 'c', parsedLLMResponse, 'requirements.md');
      
      // Get prompt history from the LLM response
      const promptHistory = JSON.parse(await fileManager.load(stepNumber, 'x', 'promptHistory.json'));
      
      return {
        success: true,
        data: {
          feedback: parsedLLMResponse,
          promptHistory: promptHistory
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }
}
