import axios from "npm:axios";
import { Language } from "./types.ts";

const shinkaiApiUrl = Deno.env.get("SHINKAI_API_URL");
const bearerToken = Deno.env.get("SHINKAI_BEARER_TOKEN");

if (!shinkaiApiUrl) {
    throw new Error("SHINKAI_API_URL is not set");
}
if (!bearerToken) {
    throw new Error("SHINKAI_BEARER_TOKEN is not set");
}

export type CheckCodeResponse = {
    success: boolean;
    warnings: string[];
};

export type GetTypescriptToolImplementationPromptResponse = {
    headers: {
        "shinkai-local-support": string;
        "shinkai-local-tools": string;
    }
    availableTools: string[];
    codePrompt: string;
    metadataPrompt: string;
    libraryCode: {
        "shinkai-local-support": string;
        "shinkai-local-tools": string;
    };
};

export type GetPythonToolImplementationPromptResponse = {
    headers: {
        "shinkai_local_support": string;
        "shinkai_local_tools": string;
    }
    availableTools: string[];
    codePrompt: string;
    metadataPrompt: string;
    libraryCode: {
        "shinkai_local_support": string;
        "shinkai_local_tools": string;
    };
};

export type CodeExecutionResponse = {
    // Define the response structure based on your API
    // This is a placeholder and should be updated with actual response fields
    success: boolean;
    result?: any;
    error?: string;
};

export type CodeExecutionConfig = {
    // Any additional configuration options
    [key: string]: any;
};

export class ShinkaiAPI {
    private shinkaiApiUrl: string;
    private bearerToken: string;
    constructor() {
        this.shinkaiApiUrl = shinkaiApiUrl!;
        this.bearerToken = bearerToken!;
    }

    public async getTypescriptToolImplementationPrompt(tools: string[] = [], code: string = ""): Promise<GetTypescriptToolImplementationPromptResponse> {
        return await this.getToolImplementationPrompt('typescript', tools, code) as GetTypescriptToolImplementationPromptResponse;
    }

    public async getPythonToolImplementationPrompt(tools: string[] = [], code: string = ""): Promise<GetPythonToolImplementationPromptResponse> {
        return await this.getToolImplementationPrompt('python', tools, code) as GetPythonToolImplementationPromptResponse;
    }

    public async executeCode(
        code: string,
        tools: string[] = [],
        parameters: any = {},
        config: CodeExecutionConfig = {},
        llmProvider: string = "GET_FROM_CODE"
    ): Promise<CodeExecutionResponse> {
        const payload = {
            code,
            tools,
            tool_type: "denodynamic",
            llm_provider: llmProvider,
            extra_config: config,
            parameters
        };

        try {
            const response = await axios<CodeExecutionResponse>({
                method: "POST",
                url: `${this.shinkaiApiUrl}/v2/code_execution`,
                data: payload,
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                    'x-shinkai-tool-id': 'no-name',
                    'x-shinkai-app-id': 'asset-test',
                    'x-shinkai-llm-provider': llmProvider,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });

            return response.data;
        } catch (error: any) {
            console.error('Error executing code:', error);
            const e = error?.response?.data?.message || error?.message || error;
            return { success: false, error: String(JSON.stringify(e)) };
        }
    }

    public async checkCode(language: Language, code: string): Promise<CheckCodeResponse> {
        const response = await axios<CheckCodeResponse>({
            method: "POST",
            url: `${this.shinkaiApiUrl}/v2/tool_check`,
            data: {
                language,
                code,
            },
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
                "Content-Type": "application/json; charset=utf-8",
            },
        });
        return response.data;
    }

    private async getToolImplementationPrompt(language: Language, tools: string[] = [], code: string = ""): Promise<GetTypescriptToolImplementationPromptResponse | GetPythonToolImplementationPromptResponse> {
        const fetch_tools = await axios<GetTypescriptToolImplementationPromptResponse | GetPythonToolImplementationPromptResponse>({
            method: "GET",
            url: `${shinkaiApiUrl}/v2/get_tool_implementation_prompt`,
            params: {
                language,
                tools: tools.join(','),
                code,
            },
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
                "Content-Type": "application/json; charset=utf-8",
            },
        });
        return fetch_tools.data;
    }
}