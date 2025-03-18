import { Application } from "jsr:@oak/oak/application";
import { Context } from "jsr:@oak/oak/context";
import { Next } from "jsr:@oak/oak/middleware";
import { Router } from "jsr:@oak/oak/router";
import { send } from "jsr:@oak/oak/send";
import "jsr:@std/dotenv/load";
import { ReadableStream } from "npm:stream/web";
import { IPLimits } from "./IPLimits.ts";
import { FileManager } from "./ShinkaiPipeline/FileManager.ts";
import { ShinkaiAPI } from "./ShinkaiPipeline/ShinkaiAPI.ts";
import { Language } from "./ShinkaiPipeline/types.ts";

const router = new Router();

const limitRequestMiddleware = async (ctx: Context, next: Next) => {
    const ip = ctx.request.ip;
    const hasSlot = await IPLimits.requestSlot(ip);
    if (!hasSlot.allowed) {
        console.log('[ERROR] ip limit', ip, hasSlot.remaining, hasSlot.nextAllowed);
        ctx.response.headers.set("Retry-After", hasSlot.nextAllowed.toString());
        ctx.response.status = 429;
        ctx.response.body = "Too many requests";
        return;
    }
    await next();
}

const setCorsHeadersMiddleware = async (ctx: Context, next: Next) => {
    // Set CORS headers first
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-SHINKAI-REQUEST-UUID, Retry-After");

    // Set streaming response headers
    ctx.response.headers.set("Cache-Control", "no-cache");
    ctx.response.headers.set("Connection", "keep-alive");
    ctx.response.headers.set("access-control-expose-headers", "Content-Type, X-SHINKAI-REQUEST-UUID, Retry-After");
    await next();
}

// Transform the raw stdout stream into properly formatted SSE events
const sseStream = () => new TransformStream({
    transform: async (chunk, controller) => {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');

        let currentEvent: string | null = null;
        let currentData: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith('EVENT: ')) {
                // If we have a previous event stored, send it
                if (currentEvent !== null) {
                    const data = currentData.length > 0 ? currentData.join('\n') : '{}';
                    controller.enqueue(`event: ${currentEvent}\ndata: ${data}\n\n`);
                    currentData = [];
                }

                // Start a new event
                currentEvent = line.substring(7).trim();
                // console.log('event', { line, currentEvent });
            } else if (line.trim() && currentEvent !== null) {
                // This is data for the current event
                currentData.push(line);
            } else if (line.trim()) {
                // This is a standalone line, not part of an event
                controller.enqueue(`event: progress\ndata: ${JSON.stringify({ message: line })}\n\n`);
            }
        }

        // Send the last event if any
        if (currentEvent !== null) {
            const data = currentData.length > 0 ? currentData.join('\n') : '{}';
            controller.enqueue(`event: ${currentEvent}\ndata: ${data}\n\n`);
        }
    }
});

// Get state of the pipeline
// query params: x_shinkai_request_uuid, language
router.get("/state", setCorsHeadersMiddleware, async (ctx: Context) => {
    const requestUUID = ctx.request.url.searchParams.get('x_shinkai_request_uuid');
    if (!requestUUID) {
        ctx.response.status = 400;
        ctx.response.body = "x_shinkai_request_uuid is required";
        return;
    }
    const language = ctx.request.url.searchParams.get('language');
    if (!language || (language !== 'typescript' && language !== 'python')) {
        ctx.response.status = 400;
        ctx.response.body = "Language is required and must be either 'typescript' or 'python'";
        return;

    }
    const state = await (new FileManager(
        language,
        requestUUID,
        true
    )).loadState();
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify(state);
});


async function generateMetadata(ctx: Context, language: Language, requestUUID: string, code: string) {
    ctx.response.headers.set("X-SHINKAI-REQUEST-UUID", requestUUID);

    // Function to run pipeline in a separate process and return a readable stream
    const runPipelineInProcess = async (language: Language, requestUUID: string, code: string): Promise<ReadableStream<Uint8Array>> => {
        // Create a new process to run the pipeline
        try {
            const delimiter = `"#|#"`
            const args = [
                "run",
                "--allow-all", // You might want to restrict permissions in production
                "src/pipeline-runner-metadata.ts", // We'll create this file to run the pipeline
                'language=' + language,
                'request-uuid=' + requestUUID,
                'code=' + delimiter + encodeURIComponent(code) + delimiter,
            ];
            console.log(`Calling Deno with args: ${args.join(' ')}`);
            const command = new Deno.Command(Deno.execPath(), {
                args: args,
                stdout: "piped",
                stderr: "piped",
            });

            const process = command.spawn();

            // Merge stdout and stderr into a single stream
            const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
            const writer = writable.getWriter();

            // Handle stdout
            (async () => {
                const decoder = new TextDecoder();
                for await (const chunk of process.stdout) {
                    await writer.write(chunk);
                }
            })();

            // Handle stderr
            (async () => {
                const decoder = new TextDecoder();
                for await (const chunk of process.stderr) {
                    // Convert stderr chunks to "error" events
                    const errorText = decoder.decode(chunk);
                    const errorEvent = `EVENT: error\n${errorText}`;
                    await writer.write(new TextEncoder().encode(errorEvent));
                }
            })();

            // Close the writer when the process exits
            (async () => {
                const status = await process.status;
                if (status.success) {
                    await writer.write(new TextEncoder().encode("EVENT: complete\n"));
                } else {
                    await writer.write(new TextEncoder().encode(`EVENT: error\nProcess exited with code ${status.code}\n`));
                }
                await writer.close();
            })();

            return readable as any;
        } catch (error) {
            console.log('>>>error');
            console.error(error);
            throw error;
        }
    };
    // Create a readable stream from the pipeline process
    const processStream = await runPipelineInProcess(language, requestUUID, code);

    // Stream the transformed events to the client
    ctx.response.body = processStream.pipeThrough((sseStream()) as any);
}


router.post("/metadata", setCorsHeadersMiddleware, limitRequestMiddleware, async (ctx: Context) => {
    const payload = await ctx.request.body.json();
    console.log('payload', payload);
    if (!payload.language) {
        ctx.response.status = 400;
        ctx.response.body = "language is required";
        return;
    }
    if (!payload.code) {
        ctx.response.status = 400;
        ctx.response.body = "code is required";
        return;
    }
    const requestUUID = new Date().getTime().toString() + '-' + crypto.randomUUID();
    await generateMetadata(ctx, payload.language, requestUUID, payload.code);
});
// Generate metadata for the pipeline
// query params: x_shinkai_request_uuid, language, code
router.get("/metadata", setCorsHeadersMiddleware, limitRequestMiddleware, async (ctx: Context) => {
    // const requestUUID = ctx.request.url.searchParams.get('x_shinkai_request_uuid');
    // if (!requestUUID) {
    //     ctx.response.status = 400;
    //     ctx.response.body = "x_shinkai_request_uuid is required";
    //     return;
    // }
    const code = ctx.request.url.searchParams.get('code');
    if (!code) {
        ctx.response.status = 400;
        ctx.response.body = "code is required";
        return;
    }
    const language = ctx.request.url.searchParams.get('language');
    if (!language || (language !== 'typescript' && language !== 'python')) {
        ctx.response.status = 400;
        ctx.response.body = "Language is required and must be either 'typescript' or 'python'";
        return;
    }
    const requestUUID = new Date().getTime().toString() + '-' + crypto.randomUUID();
    const state = await (new FileManager(
        language,
        requestUUID,
        true
    )).loadState();

    if (!state || !state.completed) {
        ctx.response.status = 400;
        ctx.response.body = "Pipeline is not complete";
        return;
    }
    await generateMetadata(ctx, language, requestUUID, code);
});

// Run code on Shinkai Node Cloud
// query params: payload: JSON string
// payload: {
//     code: string,
//     tools: string[],
//     parameters: Record<string, any>,
//     extra_config: Record<string, any>,
// }
router.get("/code_execution", setCorsHeadersMiddleware, async (ctx: Context) => {
    const payload = ctx.request.url.searchParams.get('payload');
    if (!payload) {
        ctx.response.status = 400;
        ctx.response.body = "Payload is required";
        return;
    }
    const payloadObject = JSON.parse(payload);

    const response = await (new ShinkaiAPI()).executeCode(
        payloadObject.code,
        payloadObject.tools,
        payloadObject.parameters,
        payloadObject.extra_config,
        Deno.env.get('LLM_PROVIDER') || ''
    );
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify(response);
});


async function runGenerate(ctx: Context, language: Language, requestUUID: string, prompt: string, feedback: string, skipfeedback: 'true' | 'false', toolType: 'shinkai' | 'mcp') {
    ctx.response.headers.set("X-SHINKAI-REQUEST-UUID", requestUUID);

    // Function to run pipeline in a separate process and return a readable stream
    const runPipelineInProcess = async (language: Language, requestUUID: string, prompt: string, feedback: string, skipfeedback: 'true' | 'false', toolType: string = 'shinkai'): Promise<ReadableStream<Uint8Array>> => {
        // Create a new process to run the pipeline
        try {
            const delimiter = `"#|#"`
            const args = [
                "run",
                "--allow-all", // You might want to restrict permissions in production
                "src/pipeline-runner-code.ts", // We'll create this file to run the pipeline
                'language=' + language,
                'request-uuid=' + requestUUID,
                'prompt=' + delimiter + encodeURIComponent(prompt || '') + delimiter,
                'feedback=' + delimiter + encodeURIComponent(feedback || '') + delimiter,
                'tool_type=' + toolType,
                'skipfeedback=' + skipfeedback
            ];
            console.log(`Calling Deno with args: ${args.join(' ')}`);
            const command = new Deno.Command(Deno.execPath(), {
                args: args,
                stdout: "piped",
                stderr: "piped",
            });

            const process = command.spawn();

            // Merge stdout and stderr into a single stream
            const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
            const writer = writable.getWriter();

            // Handle stdout
            (async () => {
                const decoder = new TextDecoder();
                for await (const chunk of process.stdout) {
                    await writer.write(chunk);
                }
            })();

            // Handle stderr
            (async () => {
                const decoder = new TextDecoder();
                for await (const chunk of process.stderr) {
                    // Convert stderr chunks to "error" events
                    const errorText = decoder.decode(chunk);
                    const errorEvent = `EVENT: error\n${errorText}`;
                    await writer.write(new TextEncoder().encode(errorEvent));
                }
            })();

            // Close the writer when the process exits
            (async () => {
                const status = await process.status;
                if (status.success) {
                    await writer.write(new TextEncoder().encode("EVENT: complete\n"));
                } else {
                    await writer.write(new TextEncoder().encode(`EVENT: error\nProcess exited with code ${status.code}\n`));
                }
                await writer.close();
            })();

            return readable as any;
        } catch (error) {
            console.log('>>>error');
            console.error(error);
            throw error;
        }
    };
    // Create a readable stream from the pipeline process
    const processStream = await runPipelineInProcess(language, requestUUID, prompt, feedback, skipfeedback, toolType);

    // Stream the transformed events to the client
    ctx.response.body = processStream.pipeThrough((sseStream()) as any);
}

router.post('/generate', setCorsHeadersMiddleware, limitRequestMiddleware, async (ctx: Context) => {
    const payload = await ctx.request.body.json();
    console.log('<payload>', payload);
    if (!payload.language || (payload.language !== 'typescript' && payload.language !== 'python')) {
        ctx.response.status = 400;
        ctx.response.body = "language is required and must be either 'typescript' or 'python'";
        console.log('<error>', ctx.response.body);
        return;
    }
    if (!payload.prompt) {
        ctx.response.status = 400;
        ctx.response.body = "prompt is required";
        console.log('<error>', ctx.response.body);
        return;
    }
    if (!payload.tool_type || (payload.tool_type !== 'shinkai' && payload.tool_type !== 'mcp')) {
        ctx.response.status = 400;
        ctx.response.body = "toolType is required";
        console.log('<error>', ctx.response.body);
        return;
    }
    if (!payload.skipfeedback || (payload.skipfeedback !== 'true' && payload.skipfeedback !== 'false')) {
        ctx.response.status = 400;
        ctx.response.body = "skipfeedback is required and must be either 'true' or 'false'";
        console.log('<error>', ctx.response.body);
        return;
    }
    if (!payload.requestUUID) {
        payload.requestUUID = new Date().getTime().toString() + '-' + crypto.randomUUID();
    }
    if (!payload.feedback) {
        payload.feedback = '';
    }

    console.log('<runGenerate>');
    await runGenerate(ctx, payload.language, payload.requestUUID, payload.prompt, payload.feedback, payload.skipfeedback, payload.tool_type);
});

// Execute the pipeline
// query params: language, prompt, feedback, tool_type, x_shinkai_request_uuid
router.get("/generate", setCorsHeadersMiddleware, limitRequestMiddleware, async (ctx: Context) => {
    const language = ctx.request.url.searchParams.get('language');
    const prompt = ctx.request.url.searchParams.get('prompt');
    const feedback = ctx.request.url.searchParams.get('feedback') || '';
    const toolType = ctx.request.url.searchParams.get('tool_type') || 'shinkai'; // Default to 'shinkai' if not provided
    const skipfeedback = ctx.request.url.searchParams.get('skipfeedback');

    let requestUUID = ctx.request.url.searchParams.get('x_shinkai_request_uuid');

    console.log('input', { language, prompt, feedback, toolType, skipfeedback });
    if (!language || (language !== 'typescript' && language !== 'python')) {
        ctx.response.status = 400;
        ctx.response.body = "Language is required and must be either 'typescript' or 'python'";
        return;
    }
    if (!prompt) {
        ctx.response.status = 400;
        ctx.response.body = "Prompt is required";
        return;
    }

    if (feedback && !requestUUID) {
        // error
        ctx.response.status = 400;
        ctx.response.body = "X-SHINKAI-REQUEST-UUID is required";
        return;
    }

    if (!toolType || (toolType !== 'shinkai' && toolType !== 'mcp')) {
        ctx.response.status = 400;
        ctx.response.body = "tool_type must be either 'shinkai' or 'mcp'";
        return;
    }

    ctx.response.headers.set("Content-Type", "text/event-stream");

    if (!requestUUID) {
        requestUUID = new Date().getTime().toString() + '-' + crypto.randomUUID();
    }

    if (!skipfeedback || (skipfeedback !== 'true' && skipfeedback !== 'false')) {
        ctx.response.status = 400;
        ctx.response.body = "skipfeedback must be either 'true' or 'false'";
        return;
    }

    return await runGenerate(ctx, language, requestUUID, prompt, feedback, skipfeedback, toolType);
});

// Serve the static files from public folder
router.get("/(.*)", async (ctx: Context) => {
    // Get the path from the URL
    const pathname = ctx.request.url.pathname;
    const path = pathname === "/" ? "index.html" : pathname.substring(1);

    try {
        await send(ctx, path, {
            root: Deno.cwd() + '/public',
        });
    } catch (error) {
        // If file not found, serve index.html (for SPA routing)
        if (error instanceof Deno.errors.NotFound) {
            await send(ctx, "index.html", {
                root: Deno.cwd() + '/public',
            });
        } else {
            throw error;
        }
    }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8080 });