import path from "node:path";
import { TestData } from "./types.ts";
import { BaseEngine } from "./llm-engine/BaseEngine.ts";
import { Language } from "./types.ts";

export class Paths {
  private static languageToExtension = {
    typescript: "ts",
    python: "py",
  };

  private static basePath = "results";
  private static editor = "editor";
  // Files
  private static createToolFile = "prompt-raw-create-tool.md";
  private static createMetadataFile = "prompt-raw-create-metadata.md";
  private static augmentMetadataFile = "prompt-raw-augment-metadata.md";
  private static selectToolsFile = "prompt-raw-select-tools.md";
  private static srcCodeFile = (language: Language) =>
    `extracted-src-code.${this.languageToExtension[language]}`;
  private static srcMetadataFile = "extracted-metadata.json";
  private static executeOutputFile = "execute-output.json";
  private static finalSrcCodeFile = (language: Language) =>
    `final-src-code.${this.languageToExtension[language]}`;
  private static toolsSelectedFile = "tools-selected.txt";
  private static metadataAugmentedFile = "metadata-augmented.txt";
  private static executeCheckFile = "execute-check.txt";
  private static originalCodeFile = (language: Language) =>
    `original-code.${this.languageToExtension[language]}`;
  private static rawFixedCodeFile = "raw-fixed-code.md";
  private static shinkaiLocalToolsFile = (language: Language) => {
    if (language === "python") return "shinkai_local_tools.py";
    if (language === "typescript") return "shinkai-local-tools.ts";
    throw new Error(`Unsupported language: ${language}`);
  };
  private static shinkaiSupportLibraryFile = (language: Language) => {
    if (language === "python") return "shinkai_local_support.py";
    if (language === "typescript") return "shinkai-local-support.ts";
    throw new Error(`Unsupported language: ${language}`);
  };
  private static tryFixCodeFile = "try-fix-code.md";
  private static promptCodeFile = "prompt-code.md";
  private static promptMetadataFile = "prompt-metadata.md";
  private static rawResponseCodeFile = "raw-response-code.md";
  private static rawResponseMetadataFile = "raw-response-metadata.md";
  private static vscodeSetup = ".vscode";
  private static launchCodeFile = "launch.json";
  private static editorFiles = "editor-files";

  public static executionDir(language: Language) {
    return path.join(this.basePath, language);
  }

  public static pathToCreate(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return [
      this.editorVSCodeSetup(language, test, model),
    ];
  }

  public static staticLaunchCodeFile(_language: Language) {
    return path.join(this.editorFiles, this.vscodeSetup, this.launchCodeFile);
  }

  public static editorBasePath(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(this.getBasePath(language, test, model), this.editor);
  }

  private static editorVSCodeSetup(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.editorBasePath(language, test, model),
      this.vscodeSetup,
    );
  }

  public static launchCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.editorVSCodeSetup(language, test, model),
      this.launchCodeFile,
    );
  }

  private static toolId(language: Language, test: TestData) {
    return `${language}-${
      (test.id || "").toString().padStart(5, "0")
    }-${test.code}`;
  }

  public static getBasePath(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.executionDir(language),
      this.toolId(language, test),
      model.path,
    );
  }

  public static tryFixCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.tryFixCodeFile,
    );
  }

  public static createTool(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.createToolFile,
    );
  }

  public static createMetadata(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.createMetadataFile,
    );
  }

  public static augmentMetadata(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.augmentMetadataFile,
    );
  }

  public static selectTools(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.selectToolsFile,
    );
  }

  public static srcCode(language: Language, test: TestData, model: BaseEngine) {
    return path.join(
      this.getBasePath(language, test, model),
      this.srcCodeFile(language),
    );
  }

  public static srcMetadata(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.srcMetadataFile,
    );
  }

  public static executeOutput(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.executeOutputFile,
    );
  }

  public static finalSrcCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.editor,
      this.finalSrcCodeFile(language),
    );
  }

  public static toolsSelected(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.toolsSelectedFile,
    );
  }

  public static metadataAugmented(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.metadataAugmentedFile,
    );
  }

  public static executeCheck(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.executeCheckFile,
    );
  }

  public static originalCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.originalCodeFile(language),
    );
  }

  public static rawFixedCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.rawFixedCodeFile,
    );
  }

  public static shinkaiLocalTools(
    language: Language,
    test: TestData,
    model: BaseEngine,
    editorFolder: boolean,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      editorFolder ? this.editor : "",
      this.shinkaiLocalToolsFile(language),
    );
  }


  public static shinkaiSupportLibrary(
    language: Language,
    test: TestData,
    model: BaseEngine,
    editorFolder: boolean,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      editorFolder ? this.editor : "",
      this.shinkaiSupportLibraryFile(language),
    );
  }


  public static promptCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.promptCodeFile,
    );
  }

  public static promptMetadata(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.promptMetadataFile,
    );
  }

  public static rawResponseCode(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.rawResponseCodeFile,
    );
  }

  public static rawResponseMetadata(
    language: Language,
    test: TestData,
    model: BaseEngine,
  ) {
    return path.join(
      this.getBasePath(language, test, model),
      this.rawResponseMetadataFile,
    );
  }
}
