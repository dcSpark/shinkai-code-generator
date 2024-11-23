export abstract class BaseEngine {
  constructor(public readonly name: string) {}

  abstract run(prompt: string): Promise<string>;

  // This should return an array of subclasses of BaseEngine instances, one per model.
  static getInstalledModels(): Promise<BaseEngine[]> {
    throw new Error("Implement this in the subclass");
  }
}
