export abstract class BaseEngine {
  public readonly path: string;
  public readonly shinkaiName: string;
  constructor(public readonly name: string) {
    this.path = name.replaceAll(/[^a-zA-Z0-9]/g, "-");
    // TODO how to generate names correctly for shinkai?
    this.shinkaiName = `o_${name.replaceAll(/[^a-zA-Z0-9]/g, "_")}`;
    console.log({ name: this.shinkaiName, path: this.path });
  }

  abstract run(prompt: string): Promise<string>;

  // This should return an array of subclasses of BaseEngine instances, one per model.
  static getInstalledModels(): Promise<BaseEngine[]> {
    throw new Error("Implement this in the subclass");
  }
}
