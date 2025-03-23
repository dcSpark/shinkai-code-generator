import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PipelineContext } from "../src/ShinkaiPipeline/PipelineContext.ts";
import { PipelineExecutor } from "../src/ShinkaiPipeline/PipelineExecutor.ts";
import { BasePipelineStep } from "../src/ShinkaiPipeline/steps/BasePipelineStep.ts";
import { FileManager } from "../src/ShinkaiPipeline/FileManager.ts";
import { IPipelineStep, IPipelineStepResult } from "../src/ShinkaiPipeline/interfaces/IPipelineStep.ts";
import { EnvironmentService } from "../src/ShinkaiPipeline/services/EnvironmentService.ts";
import { Payload } from "../src/ShinkaiPipeline/llm-engines.ts";

// Mock types for testing
type MockOpenAIMessage = {
  role: "user" | "assistant" | "developer";
  content: string;
};

type MockPayload = {
  model: string;
  messages: MockOpenAIMessage[];
};

// Create a mock payload for testing
const createMockPayload = (): MockPayload => ({
  model: "test-model",
  messages: [{ role: "user", content: "Test prompt" }]
});

// Mock environment service for testing
class MockEnvironmentService extends EnvironmentService {
  private envVars: Record<string, string> = {};
  
  override get(key: string): string | undefined {
    return this.envVars[key];
  }
  
  set(key: string, value: string): void {
    this.envVars[key] = value;
  }
}

// Mock file manager for testing
class MockFileManager extends FileManager {
  private files: Record<string, string> = {};
  
  constructor() {
    super('typescript', 'test', false);
  }
  
  override async save(step: number, substep: string, text: string, fileName: string): Promise<string> {
    const key = `${step}.${substep}.${fileName}`;
    this.files[key] = text;
    return key;
  }
  
  override async load(step: number, substep: string, fileName: string): Promise<string> {
    const key = `${step}.${substep}.${fileName}`;
    return this.files[key] || '';
  }
  
  override async exists(step: number, substep: string, fileName: string): Promise<boolean> {
    const key = `${step}.${substep}.${fileName}`;
    return key in this.files;
  }
}

// Test step implementation
class TestStep extends BasePipelineStep {
  public executeCalled = false;
  public shouldSkipCalled = false;
  public shouldSkipResult = false;
  public executeResult: IPipelineStepResult = { success: true, data: 'test data' };
  
  constructor(envService: EnvironmentService = new EnvironmentService()) {
    super(envService);
  }
  
  override async execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult> {
    this.executeCalled = true;
    return this.executeResult;
  }
  
  override async shouldSkip(): Promise<boolean> {
    this.shouldSkipCalled = true;
    return this.shouldSkipResult;
  }
}

Deno.test("PipelineContext state management", async () => {
  const context = new PipelineContext();
  
  // Test initial state
  assertEquals(context.getStep(), 0);
  assertEquals(context.getFeedback(), "");
  assertEquals(context.getPromptHistory(), undefined);
  
  // Test state updates
  context.setFeedback("Test feedback");
  assertEquals(context.getFeedback(), "Test feedback");
  
  context.incrementStep();
  assertEquals(context.getStep(), 1);
  
  const mockPayload = createMockPayload();
  context.setPromptHistory(mockPayload as Payload);
  assertEquals(context.getPromptHistory(), mockPayload);
  
  // Test other properties
  const testDocs = { "doc1": "Test document content" };
  context.setDocs(testDocs);
  assertEquals(context.getDocs(), testDocs);
  
  context.setPerplexityResults("Test perplexity results");
  assertEquals(context.getPerplexityResults(), "Test perplexity results");
});

Deno.test("PipelineExecutor with successful step", async () => {
  const context = new PipelineContext();
  const fileManager = new MockFileManager();
  const testStep = new TestStep();
  const executor = new PipelineExecutor([testStep], fileManager, context);
  
  // Execute the pipeline
  const result = await executor.execute();
  
  // Verify step was executed
  assertEquals(testStep.executeCalled, true);
  assertEquals(testStep.shouldSkipCalled, true);
  
  // Verify context was updated
  assertEquals(result.getStep(), 1);
});

Deno.test("PipelineExecutor with skipped step", async () => {
  const context = new PipelineContext();
  const fileManager = new MockFileManager();
  const testStep = new TestStep();
  testStep.shouldSkipResult = true;
  const executor = new PipelineExecutor([testStep], fileManager, context);
  
  // Execute the pipeline
  const result = await executor.execute();
  
  // Verify step was skipped
  assertEquals(testStep.executeCalled, false);
  assertEquals(testStep.shouldSkipCalled, true);
  
  // Verify context was not updated since step was skipped
  assertEquals(result.getStep(), 0);
});

Deno.test("PipelineExecutor with failed step", async () => {
  const context = new PipelineContext();
  const fileManager = new MockFileManager();
  const testStep = new TestStep();
  testStep.executeResult = { success: false, error: new Error("Test error") };
  const executor = new PipelineExecutor([testStep], fileManager, context);
  
  // Execute the pipeline
  const result = await executor.execute();
  
  // Verify step was executed
  assertEquals(testStep.executeCalled, true);
  assertEquals(testStep.shouldSkipCalled, true);
  
  // Verify context was not updated (step failed)
  assertEquals(result.getStep(), 0);
});

Deno.test("BasePipelineStep loadFromCache", async () => {
  const fileManager = new MockFileManager();
  const testStep = new TestStep();
  
  // Save test data to cache
  await fileManager.save(1, 'c', 'cached data', 'test.txt');
  
  // Load from cache
  const result = await testStep.loadFromCache(1, fileManager, 'test', 'txt');
  
  // Verify cache was loaded
  assertEquals(result.success, true);
  assertEquals(result.data, 'cached data');
  
  // Test cache miss
  const missResult = await testStep.loadFromCache(2, fileManager, 'missing', 'txt');
  assertEquals(missResult.success, false);
});

Deno.test("EnvironmentService with mock", async () => {
  const envService = new MockEnvironmentService();
  
  // Set and get environment variables
  envService.set('TEST_KEY', 'test_value');
  assertEquals(envService.get('TEST_KEY'), 'test_value');
  assertEquals(envService.get('MISSING_KEY'), undefined);
});

Deno.test("PipelineContext plan and code state changes", async () => {
  const context = new PipelineContext();
  
  // Test plan state changes
  const testPlan = "Step 1: Initialize\nStep 2: Process data";
  context.setPlan(testPlan);
  assertEquals(context.getPlan(), testPlan);
  
  // Test code state changes
  const testCode = "function sum(a, b) { return a + b; }";
  context.setCode(testCode);
  assertEquals(context.getCode(), testCode);
  
  // Test metadata state changes
  const testMetadata = "{ \"name\": \"Test Tool\", \"description\": \"A test tool\" }";
  context.setMetadata(testMetadata);
  assertEquals(context.getMetadata(), testMetadata);
});

class MockRequirementsStep extends BasePipelineStep {
  constructor(envService: EnvironmentService = new EnvironmentService()) {
    super(envService);
  }
  
  override async execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult> {
    await fileManager.save(stepNumber, 'p', 'Mock requirements executed', 'execution.log');
    return {
      success: true,
      data: "Mock requirements"
    };
  }
}

class MockPlanningStep extends BasePipelineStep {
  constructor(envService: EnvironmentService = new EnvironmentService()) {
    super(envService);
  }
  
  override async execute(stepNumber: number, fileManager: FileManager): Promise<IPipelineStepResult> {
    await fileManager.save(stepNumber, 'p', 'Mock planning executed', 'execution.log');
    return {
      success: true,
      data: "Mock plan"
    };
  }
}

Deno.test("Full pipeline execution with state transitions", async () => {
  const context = new PipelineContext();
  const fileManager = new MockFileManager();
  const requirementsStep = new MockRequirementsStep();
  const planningStep = new MockPlanningStep();
  
  const executor = new PipelineExecutor(
    [requirementsStep, planningStep],
    fileManager,
    context
  );
  
  // Execute the pipeline
  const result = await executor.execute();
  
  // Verify final state
  assertEquals(result.getStep(), 2);
  
  // Step execution logs should be saved to the file manager
  const exists = await fileManager.exists(0, "p", "execution.log");
  assertEquals(exists, true);
});
