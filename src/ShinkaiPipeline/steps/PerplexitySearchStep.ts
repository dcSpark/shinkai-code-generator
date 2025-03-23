import { FileManager } from "../FileManager.ts";
import { BasePipelineStep } from "./BasePipelineStep.ts";
import { IPipelineStepResult } from "../interfaces/IPipelineStep.ts";

export class PerplexitySearchStep extends BasePipelineStep {
  constructor(private testPrompt: string) {
    super();
  }
  
  async shouldSkip(): Promise<boolean> {
    const perplexityApiKey = this.envService.get('PERPLEXITY_API_KEY');
    return !perplexityApiKey;
  }
  
  async execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult> {
    const cacheResult = await this.loadFromCache(stepNumber, fileManager, 'perplexity', 'md');
    if (cacheResult.success) {
      return cacheResult;
    }
    
    const perplexityApiKey = this.envService.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      await fileManager.log(`[Planning Step ${stepNumber}] Skipping Perplexity search - API key not found`, true);
      return { success: false };
    }
    
    fileManager.log(`[Planning Step ${stepNumber}] Searching Perplexity for additional context`, true);
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${perplexityApiKey}`
        },
        body: JSON.stringify({
          model: 'sonar-reasoning',
          messages: [{
            role: 'user',
            content: `I need to implement the following functionality: ${this.testPrompt}\n\nPlease provide detailed technical information, implementation approaches, best practices, and any relevant code examples or libraries that could help implement this.`
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const perplexityResults = data.choices[0].message.content;
      await fileManager.save(stepNumber, 'c', perplexityResults, 'perplexity.md');
      
      return {
        success: true,
        data: perplexityResults
      };
    } catch (error: unknown) {
      await fileManager.log(`[Warning] Perplexity search failed: ${error instanceof Error ? error.message : String(error)}`, true);
      return { success: false };
    }
  }
}
