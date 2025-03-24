import { Payload } from "../Engines/index.ts";

export class PipelineContext {
  step: number = 0;
  feedback: string = '';
  promptHistory?: Payload;
  docs: Record<string, string> = {};
  perplexityResults: string = '';
  internalToolsJSON: string[] = [];
  plan: string = '';
  code: string = '';
  metadata: string = '';
  tests: { input: Record<string, any>, config: Record<string, any>, output: Record<string, any> }[] = [];
  
  constructor() {}
  
  incrementStep(): void {
    this.step++;
  }
  
  getStep(): number {
    return this.step;
  }
  
  setFeedback(feedback: string): void {
    this.feedback = feedback;
  }
  
  getFeedback(): string {
    return this.feedback;
  }
  
  setPromptHistory(promptHistory: Payload): void {
    this.promptHistory = promptHistory;
  }
  
  getPromptHistory(): Payload | undefined {
    return this.promptHistory;
  }
  
  setDocs(docs: Record<string, string>): void {
    this.docs = docs;
  }
  
  getDocs(): Record<string, string> {
    return this.docs;
  }
  
  setPerplexityResults(results: string): void {
    this.perplexityResults = results;
  }
  
  getPerplexityResults(): string {
    return this.perplexityResults;
  }
  
  setInternalToolsJSON(tools: string[]): void {
    this.internalToolsJSON = tools;
  }
  
  getInternalToolsJSON(): string[] {
    return this.internalToolsJSON;
  }
  
  setPlan(plan: string): void {
    this.plan = plan;
  }
  
  getPlan(): string {
    return this.plan;
  }
  
  setCode(code: string): void {
    this.code = code;
  }
  
  getCode(): string {
    return this.code;
  }
  
  setMetadata(metadata: string): void {
    this.metadata = metadata;
  }
  
  getMetadata(): string {
    return this.metadata;
  }
  
  setTests(tests: { input: Record<string, any>, config: Record<string, any>, output: Record<string, any> }[]): void {
    this.tests = tests;
  }
  
  getTests(): { input: Record<string, any>, config: Record<string, any>, output: Record<string, any> }[] {
    return this.tests;
  }
}
