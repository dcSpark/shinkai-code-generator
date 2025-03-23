// deno-lint-ignore-file no-explicit-any

/**
 * Service for environment-related operations
 * This class wraps Deno API calls to make them easier to mock in tests
 */
export class EnvironmentService {
  /**
   * Get an environment variable
   */
  get(key: string): string | undefined {
    // @ts-ignore: Deno namespace
    return Deno.env.get(key);
  }
  
  /**
   * Get current working directory
   */
  getCwd(): string {
    // @ts-ignore: Deno namespace
    return Deno.cwd();
  }
  
  /**
   * Read a text file asynchronously
   */
  readTextFile(path: string): Promise<string> {
    // @ts-ignore: Deno namespace
    return Deno.readTextFile(path);
  }
  
  /**
   * Read a text file synchronously
   */
  readTextFileSync(path: string): string {
    // @ts-ignore: Deno namespace
    return Deno.readTextFileSync(path);
  }
  
  /**
   * Write to a text file asynchronously with options
   */
  async writeTextFile(path: string, content: string, options?: { append?: boolean, createDir?: boolean }): Promise<void> {
    if (options?.createDir) {
      // @ts-ignore: Deno namespace
      await Deno.mkdir(path.substring(0, path.lastIndexOf('/')), { recursive: true });
    }
    
    if (options?.append) {
      // @ts-ignore: Deno namespace
      const file = await Deno.open(path, { create: true, append: true });
      await file.write(new TextEncoder().encode(content));
      file.close();
      return;
    }
    
    // @ts-ignore: Deno namespace
    return Deno.writeTextFile(path, content);
  }
  
  /**
   * Write to a text file synchronously
   */
  writeTextFileSync(path: string, content: string): void {
    // @ts-ignore: Deno namespace
    return Deno.writeTextFileSync(path, content);
  }
  
  /**
   * Check if a file or directory exists
   */
  async exists(path: string): Promise<boolean> {
    try {
      // @ts-ignore: Deno namespace
      await Deno.stat(path);
      return true;
    } catch (error) {
      // @ts-ignore: Deno namespace
      if (error instanceof Deno.errors.NotFound) {
        return false;
      }
      throw error;
    }
  }
}
