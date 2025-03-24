import { FileManager } from "../ShinkaiPipeline/FileManager.ts";
import { Payload } from "./index.ts";

export abstract class BaseEngine {
    public readonly path: string;
    public readonly shinkaiName: string;

    constructor(
        public readonly name: string,
    ) {
        this.path = name.replaceAll(/[^a-zA-Z0-9]/g, "-");
        // TODO how to generate names correctly for shinkai?
        this.shinkaiName = `o_${name.replaceAll(/[^a-zA-Z0-9]/g, "_")}`;
    }

    abstract run(
        prompt: string,
        logger: FileManager | undefined,
        payloadHistory: Payload | undefined,
        thinkingAbout?: string
    ): Promise<{ message: string, metadata: Payload }>;

}