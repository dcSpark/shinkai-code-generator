export class EnvironmentService {
  get(key: string): string | undefined {
    return Deno.env.get(key);
  }
  
  getCwd(): string {
    return Deno.cwd();
  }
  
  readTextFile(path: string): Promise<string> {
    return Deno.readTextFile(path);
  }
  
  readTextFileSync(path: string): string {
    return Deno.readTextFileSync(path);
  }
  
  writeTextFile(path: string, content: string): Promise<void> {
    return Deno.writeTextFile(path, content);
  }
  
  writeTextFileSync(path: string, content: string): void {
    return Deno.writeTextFileSync(path, content);
  }
}
