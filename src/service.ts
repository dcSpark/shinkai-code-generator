import { Application } from "jsr:@oak/oak/application";
import { Context } from "jsr:@oak/oak/context";
import { Router } from "jsr:@oak/oak/router";
import { send } from "jsr:@oak/oak/send";
import { ReadableStream } from "npm:stream/web";
import { Language } from "./types.ts";

const router = new Router();
router.get("/generate", async (ctx: Context) => {
    console.log('>>>generate');
    const language = ctx.request.url.searchParams.get('language');
    const prompt = ctx.request.url.searchParams.get('prompt');
    const feedback = ctx.request.url.searchParams.get('feedback') || '';
    const toolType = ctx.request.url.searchParams.get('tool_type') || 'shinkai'; // Default to 'shinkai' if not provided
    let requestUUID = ctx.request.url.searchParams.get('x_shinkai_request_uuid');

    console.log('input', { language, prompt, feedback, toolType });
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

    // Set CORS headers first
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-SHINKAI-REQUEST-UUID");

    // Set streaming response headers
    ctx.response.headers.set("Content-Type", "text/event-stream");
    ctx.response.headers.set("Cache-Control", "no-cache");
    ctx.response.headers.set("Connection", "keep-alive");
    ctx.response.headers.set("access-control-expose-headers", "X-SHINKAI-REQUEST-UUID");

    if (feedback && !requestUUID) {
        // error
        ctx.response.status = 400;
        ctx.response.body = "X-SHINKAI-REQUEST-UUID is required";
        return;
    }


    if (!requestUUID) {
        requestUUID = new Date().getTime().toString() + '-' + crypto.randomUUID();
    }

    ctx.response.headers.set("X-SHINKAI-REQUEST-UUID", requestUUID);

    // Create a readable stream from the pipeline process
    const processStream = await runPipelineInProcess(language, requestUUID, prompt, feedback, toolType);


    // Transform the raw stdout stream into properly formatted SSE events
    const sseStream = new TransformStream({
        transform: async (chunk, controller) => {
            const text = new TextDecoder().decode(chunk);
            const lines = text.split('\n');

            for (const line of lines) {
                if (line.startsWith('EVENT: ')) {
                    const [eventType, ...eventData] = line.substring(7).split('\n');
                    const data = eventData.join('\n');

                    // Format as Server-Sent Event
                    if (data) {
                        controller.enqueue(`event: ${eventType}\ndata: ${data}\n\n`);
                    } else {
                        controller.enqueue(`event: ${eventType}\ndata: {}\n\n`);
                    }
                } else if (line.trim()) {
                    // Send other output as progress events
                    controller.enqueue(`event: progress\ndata: ${JSON.stringify({ message: line })}\n\n`);
                }
            }
        }
    });

    // Stream the transformed events to the client
    ctx.response.body = processStream.pipeThrough(sseStream as any);
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

// Function to run pipeline in a separate process and return a readable stream
const runPipelineInProcess = async (language: Language, requestUUID: string, prompt: string, feedback: string, toolType: string = 'shinkai'): Promise<ReadableStream<Uint8Array>> => {
    // Create a new process to run the pipeline
    try {
        const delimiter = `"#|#"`
        const args = [
            "run",
            "--allow-all", // You might want to restrict permissions in production
            "src/pipeline-runner.ts", // We'll create this file to run the pipeline
            'language=' + language,
            'request-uuid=' + requestUUID,
            'prompt=' + delimiter + encodeURIComponent(prompt || '') + delimiter,
            'feedback=' + delimiter + encodeURIComponent(feedback || '') + delimiter,
            'tool_type=' + toolType
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

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8080 });