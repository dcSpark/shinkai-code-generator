import { dirname, fromFileUrl } from "jsr:@std/path";
import { readFileSync } from "node:fs";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "npm:zod";
import { run } from "./tool.ts";


// Read metadata.json
const metadata = JSON.parse(readFileSync(dirname(fromFileUrl(import.meta.url)) + "/metadata.json", "utf-8"));

/**
 * Converts a name to a valid [a-z0-9_] format
 * @param name The original name    
 * @returns A valid name with only lowercase letters, numbers, and underscores
 */
function generateValidName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .trim();
}

/**
 * Converts JSON schema parameters to Zod schema
 * @param parameters The parameters object from metadata.json
 * @returns A Zod schema object
 */
function generateZodSchema(parameters: any): Record<string, z.ZodType> {
    const schema: Record<string, z.ZodType> = {};

    if (parameters?.properties) {
        for (const [key, value] of Object.entries(parameters.properties)) {
            const prop = value as any;

            if (prop.type === "number") {
                schema[key] = z.number();
            } else if (prop.type === "string") {
                schema[key] = z.string();
            } else if (prop.type === "boolean") {
                schema[key] = z.boolean();
            } else if (Array.isArray(prop.type)) {
                // Handle union types
                if (prop.type.includes("number") && prop.type.includes("string")) {
                    schema[key] = z.union([z.number(), z.string()]);
                } else {
                    // Default to string for unsupported types
                    schema[key] = z.string();
                }
            } else {
                // Default to string for unsupported types
                schema[key] = z.string();
            }
        }
    }

    return schema;
}

/**
 * Dynamically builds input parameters based on metadata and zod schema
 * @param inputs The raw inputs from the tool call
 * @param metadataParams The parameters object from metadata.json
 * @returns A properly typed input object for the tool
 */
function buildToolInputs(inputs: Record<string, any>, metadataParams: any): Record<string, any> {
    const typedInputs: Record<string, any> = {};

    if (metadataParams?.properties) {
        for (const [key, value] of Object.entries(metadataParams.properties)) {
            const prop = value as any;

            if (inputs[key] !== undefined) {
                if (prop.type === "number") {
                    typedInputs[key] = Number(inputs[key]);
                } else if (prop.type === "boolean") {
                    typedInputs[key] = Boolean(inputs[key]);
                } else if (prop.type === "string" || Array.isArray(prop.type)) {
                    typedInputs[key] = String(inputs[key]);
                } else {
                    // Default handling
                    typedInputs[key] = inputs[key];
                }
            }
        }
    }

    return typedInputs;
}

// Create an MCP server
const server = new McpServer({
    name: metadata.name || "Math Operation Validator",
    version: metadata.version || "1.0.0"
});

// Generate valid tool name
const toolName = generateValidName(metadata.name);

// Generate Zod schema from parameters
const paramSchema = generateZodSchema(metadata.parameters);

// Add the tool with dynamic parameter handling
server.tool(
    toolName,
    paramSchema,
    async (inputs) => {
        // Build inputs dynamically based on metadata
        const typedInputs = buildToolInputs(inputs, metadata.parameters);

        // Call the run function from the tool.ts file
        const result = await run({}, typedInputs as any);
        return {
            content: [{ type: "text", text: JSON.stringify(result) }]
        };
    }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
