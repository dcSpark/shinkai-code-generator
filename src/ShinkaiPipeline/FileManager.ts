import { exists } from "jsr:@std/fs/exists";
import * as path from "jsr:@std/path";
import { Language } from "./types.ts";
import { EnvironmentService } from "./services/EnvironmentService.ts";

// Simple path joining function to replace path.join
function joinPaths(...paths: string[]): string {
  return paths.join('/').replace(/\/+/g, '/');
}

export class FileManager {
    public toolDir: string;
    private static envService = new EnvironmentService();
    private static basePath = joinPaths(FileManager.envService.getCwd(), 'cache', '.execution');
    private envService: EnvironmentService;

    constructor(private language: Language, runCode: string, private stream: boolean) {
        this.envService = new EnvironmentService();
        this.toolDir = joinPaths(
            FileManager.basePath,
            runCode
        );
    }

    async log(message: string, stdout: boolean = false) {
        const filePath = joinPaths(this.toolDir, `log.txt`);
        await this.envService.writeTextFile(filePath, message + '\n', { append: true, createDir: true });
        if (stdout || this.stream) {
            console.log(message);
        }
    }

    async saveCache(fileName: string, text: string): Promise<void> {
        if (this.envService.get('CACHE') === 'false') {
            return;
        }
        const basePath = joinPaths(this.envService.getCwd(), 'cache', '.internal');
        const filePath = joinPaths(basePath, fileName);
        await this.envService.writeTextFile(filePath, text, { createDir: true });
        if (this.envService.get('DEBUG') === 'true') {
            console.log(`EVENT: debug\n[DEBUG] Saved Cache ::: ${filePath}`);
        }
    }

    async loadCache(fileName: string): Promise<string | null> {
        if (this.envService.get('CACHE') === 'false') {
            return null;
        }
        const basePath = joinPaths(this.envService.getCwd(), 'cache', '.internal');
        const filePath = joinPaths(basePath, fileName);
        if (!await this.envService.exists(filePath)) {
            if (this.envService.get('DEBUG') === 'true') {
                // console.log(`EVENT: debug\n[DEBUG] Cache Not Found ::: ${filePath}`);
            }
            return null;
        }
        if (this.envService.get('DEBUG') === 'true') {
            console.log(`EVENT: debug\n[DEBUG] Loaded Cache ::: ${filePath}`);
        }
        return await this.envService.readTextFile(filePath);
    }

    async save(step: number, substep: string, text: string, fileName: string): Promise<string> {
        const filePath = joinPaths(this.toolDir, `step_${step}.${substep}.${fileName}`);
        await this.envService.writeTextFile(filePath, text, { createDir: true });
        if (this.envService.get('DEBUG') === 'true') {
            console.log(`EVENT: debug\n[DEBUG] Saved File ::: ${filePath}`);
        }
        const state = await this.loadState();
        if (!state.exists) {
            await this.writeState({
                date: new Date().toISOString(),
                feedback_expected: false,
            });
        }
        return filePath;
    }

    async saveFinal(code: string, metadata: string | undefined) {
        const srcPath = joinPaths(this.toolDir, `src`);
        if (this.language === 'typescript') {
            const filePath1 = joinPaths(srcPath, `tool.ts`);
            const filePath2 = joinPaths(srcPath, `metadata.json`);
            
            if (code) {
                await this.envService.writeTextFile(filePath1, code, { createDir: true });
            }
            if (metadata) {
                await this.envService.writeTextFile(filePath2, metadata, { createDir: true });
            }
        } else if (this.language === 'python') {
            const filePath = joinPaths(srcPath, `tool.py`);
            const filePath2 = joinPaths(srcPath, `metadata.json`);
            
            if (code) {
                await this.envService.writeTextFile(filePath, code, { createDir: true });
            }
            if (metadata) {
                await this.envService.writeTextFile(filePath2, metadata, { createDir: true });
            }
        }
        await this.writeState({
            date: new Date().toISOString(),
            feedback_expected: false,
        });
    }

    async exists(step: number, substep: string, fileName: string) {
        const filePath = joinPaths(this.toolDir, `step_${step}.${substep}.${fileName}`);
        return await this.envService.exists(filePath);
    }

    async writeState(config: { date: string, feedback_expected: boolean, completed?: boolean }) {
        const filePath = joinPaths(this.toolDir, `state.json`);
        await this.envService.writeTextFile(filePath, JSON.stringify(config), { createDir: true });
    }

    async loadState(): Promise<{ exists: boolean, completed: boolean, date: string, feedback_expected: boolean, metadata: boolean }> {
        const filePath = joinPaths(this.toolDir, `state.json`);
        if (!await this.envService.exists(filePath)) {
            return {
                exists: false,
                completed: false,
                date: new Date().toISOString(),
                feedback_expected: false,
                metadata: false,
            };
        }

        const srcPath = joinPaths(this.toolDir, `src`);

        const codePath1 = joinPaths(srcPath, `tool.ts`);
        const codePath2 = joinPaths(srcPath, `tool.py`);
        const metadataPath1 = joinPaths(srcPath, `metadata.json`);

        const completed = await this.envService.exists(codePath1) || await this.envService.exists(codePath2);
        const metadata = await this.envService.exists(metadataPath1);

        const state: { date: string, feedback_expected: boolean } = JSON.parse(await this.envService.readTextFile(filePath));
        return {
            ...state,
            exists: true,
            metadata,
            completed,
        };
    }

    async load(step: number, substep: string, fileName: string) {
        const filePath = joinPaths(this.toolDir, `step_${step}.${substep}.${fileName}`);
        return await this.envService.readTextFile(filePath);
    }

    public static async clearFolder() {
        if (await FileManager.envService.exists(FileManager.basePath)) {
            // @ts-ignore: Deno namespace
            await Deno.remove(FileManager.basePath, { recursive: true });
        }
        // @ts-ignore: Deno namespace
        await Deno.mkdir(FileManager.basePath, { recursive: true });
    }
}
