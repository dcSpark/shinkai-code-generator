import { FileManager } from "../FileManager.ts";
import { IPipelineStep, IPipelineStepResult } from "../interfaces/IPipelineStep.ts";
import { EnvironmentService } from "../services/EnvironmentService.ts";

export abstract class BasePipelineStep implements IPipelineStep {
  protected envService: EnvironmentService;
  
  constructor(envService: EnvironmentService = new EnvironmentService()) {
    this.envService = envService;
  }
  
  abstract execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult>;
  
  async shouldSkip(): Promise<boolean> {
    return false;
  }
  
  async loadFromCache(stepNumber: number, fileManager: FileManager, fileName: string, fileExtension: string): Promise<IPipelineStepResult> {
    if (await fileManager.exists(stepNumber, 'c', `${fileName}.${fileExtension}`)) {
      const data = await fileManager.load(stepNumber, 'c', `${fileName}.${fileExtension}`);
      return {
        success: true,
        data
      };
    }
    return { success: false };
  }
}
