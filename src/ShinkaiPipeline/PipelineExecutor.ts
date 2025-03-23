import { FileManager } from "./FileManager.ts";
import { IPipelineStep } from "./interfaces/IPipelineStep.ts";
import { PipelineContext } from "./PipelineContext.ts";

export class PipelineExecutor {
  constructor(
    private steps: IPipelineStep[],
    private fileManager: FileManager,
    private context: PipelineContext
  ) {}
  
  async executeStep(step: IPipelineStep): Promise<boolean> {
    const shouldSkip = await step.shouldSkip();
    if (shouldSkip) {
      return true;
    }
    
    const result = await step.execute(this.context.getStep(), this.fileManager);
    if (result.success) {
      this.context.incrementStep();
      return true;
    }
    return false;
  }
  
  async execute(): Promise<PipelineContext> {
    for (const step of this.steps) {
      await this.executeStep(step);
    }
    return this.context;
  }
}
