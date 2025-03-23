import { FileManager } from "../FileManager.ts";

export interface IPipelineStepResult {
  success: boolean;
  data?: any;
  error?: Error;
}

export interface IPipelineStep {
  execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult>;
  shouldSkip(): Promise<boolean>;
  loadFromCache(stepNumber: number, fileManager: FileManager, fileName: string, fileExtension: string): Promise<IPipelineStepResult>;
}
