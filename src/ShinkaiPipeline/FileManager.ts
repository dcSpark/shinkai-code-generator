import { exists } from "jsr:@std/fs/exists";
import path from "node:path";
import { Requirement } from "./Requirement.ts";
import { BaseEngine } from "./llm-engines.ts";
import { Language } from "./types.ts";

export class FileManager {

    public toolDir: string;
    private static basePath = path.join(Deno.cwd(), 'cache', '.execution');

    constructor(private language: Language, test: Requirement, model: BaseEngine, private stream: boolean) {
        this.toolDir = path.join(
            FileManager.basePath,
            model.path,
            test.code,
            language,
        );
    }

    async log(message: string, stdout: boolean = false) {
        const filePath = path.join(this.toolDir, `log.txt`);
        await Deno.mkdir(this.toolDir, { recursive: true });
        const file = await Deno.open(filePath, { create: true, append: true });
        await file.write(new TextEncoder().encode(message + '\n'));
        file.close();
        if (stdout || this.stream) {
            console.log(message);
        }
    }

    async save(step: number, substep: string, text: string, fileName: string): Promise<string> {
        const filePath = path.join(this.toolDir, `step_${step}.${substep}.${fileName}`);
        await Deno.mkdir(this.toolDir, { recursive: true });
        await Deno.writeTextFile(filePath, text);
        if (Deno.env.get('DEBUG') === 'true') {
            console.log(`[DEBUG] Saved File: ${filePath}`);
        }
        return filePath;
    }

    async saveFinal(tool: string, metadata: string) {
        const srcPath = path.join(this.toolDir, `src`);
        if (this.language === 'typescript') {
            const filePath1 = path.join(srcPath, `tool.ts`);
            const filePath2 = path.join(srcPath, `metadata.json`);
            await Deno.mkdir(srcPath, { recursive: true });
            await Deno.writeTextFile(filePath1, tool);
            await Deno.writeTextFile(filePath2, metadata);
        } else if (this.language === 'python') {
            const filePath = path.join(srcPath, `tool.py`);
            const filePath2 = path.join(srcPath, `metadata.json`);
            await Deno.mkdir(srcPath, { recursive: true });
            await Deno.writeTextFile(filePath, tool);
            await Deno.writeTextFile(filePath2, metadata);
        }
    }

    async exists(step: number, substep: string, fileName: string) {
        const filePath = path.join(this.toolDir, `step_${step}.${substep}.${fileName}`);
        return await exists(filePath);
    }

    async load(step: number, substep: string, fileName: string) {
        const filePath = path.join(this.toolDir, `step_${step}.${substep}.${fileName}`);
        return await Deno.readTextFile(filePath);
    }

    public static async clearFolder() {
        if (await exists(FileManager.basePath)) {
            await Deno.remove(FileManager.basePath, { recursive: true });
        }
        await Deno.mkdir(FileManager.basePath, { recursive: true });
    }
}