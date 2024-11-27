import path from "node:path";
import { TestData } from "./types.ts";
import { BaseEngine } from "./llm-engine/BaseEngine.ts";

export class Paths {
  private static basePath = 'results';

  // Files
  private static createToolFile = "prompt-raw-create-tool.md";
  private static createMetadataFile = "prompt-raw-create-metadata.md";
  private static augmentMetadataFile = "prompt-raw-augment-metadata.md";
  private static selectToolsFile = "prompt-raw-select-tools.md";
  private static srcCodeFile = "extracted-src-code.ts";
  private static srcMetadataFile = "extracted-metadata.json";
  private static executeOutputFile = "execute-output.json";
  private static finalSrcCodeFile = "final-src-code.ts";
  private static toolsSelectedFile = "tools-selected.txt";
  private static metadataAugmentedFile = "metadata-augmented.txt";
  private static executeCheckFile = "execute-check.txt";
  private static originalCodeFile = "original-code.ts";
  private static rawFixedCodeFile = "raw-fixed-code.md";
  private static shinkaiLocalToolsFile = "shinkai-local-tools.ts";
  private static tryFixCodeFile = "try-fix-code.md";
  private static promptCodeFile = "prompt-code.md";
  private static promptMetadataFile = "prompt-metadata.md";
  private static rawResponseCodeFile = "raw-response-code.md";
  private static rawResponseMetadataFile = "raw-response-metadata.md";

  public static executionDir() {
    return this.basePath;
  }

  private static toolId(test: TestData) {
    return `${(test.id || "").toString().padStart(5, "0")}-${test.code}`;
  }

  public static getBasePath(test: TestData, model: BaseEngine) {
    return path.join(this.basePath, this.toolId(test), model.path);
  }

  public static tryFixCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.tryFixCodeFile);
  }

  public static createTool(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.createToolFile);
  }

  public static createMetadata(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.createMetadataFile);
  }

  public static augmentMetadata(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.augmentMetadataFile);
  }

  public static selectTools(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.selectToolsFile);
  }

  public static srcCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.srcCodeFile);
  }

  public static srcMetadata(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.srcMetadataFile);
  }

  public static executeOutput(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.executeOutputFile);
  }

  public static finalSrcCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.finalSrcCodeFile);
  }

  public static toolsSelected(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.toolsSelectedFile);
  }

  public static metadataAugmented(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.metadataAugmentedFile);
  }

  public static executeCheck(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.executeCheckFile);
  }

  public static originalCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.originalCodeFile);
  }

  public static rawFixedCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.rawFixedCodeFile);
  }

  public static shinkaiLocalTools(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.shinkaiLocalToolsFile);
  }

  public static promptCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.promptCodeFile);
  }

  public static promptMetadata(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.promptMetadataFile);
  }

  public static rawResponseCode(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.rawResponseCodeFile);
  }

  public static rawResponseMetadata(test: TestData, model: BaseEngine) {
    return path.join(this.getBasePath(test, model), this.rawResponseMetadataFile);
  }
}
