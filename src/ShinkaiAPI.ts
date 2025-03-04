import axios from "npm:axios";
import { Language } from "./types.ts";

const shinkaiApiUrl = Deno.env.get("SHINKAI_API_URL");
const bearerToken = Deno.env.get("SHINKAI_BEARER_TOKEN");

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

export class ShinkaiAPI {
    private shinkaiApiUrl: string;
    private bearerToken: string;
    constructor() {
        if (!shinkaiApiUrl) {
            throw new Error("SHINKAI_API_URL is not set");
        }
        if (!bearerToken) {
            throw new Error("SHINKAI_BEARER_TOKEN is not set");
        }

        this.shinkaiApiUrl = shinkaiApiUrl;
        this.bearerToken = bearerToken;
    }

    public async getTypescriptToolImplementationPrompt(tools: string[] = [], code: string = ""): Promise<GetTypescriptToolImplementationPromptResponse> {
        return await this.getToolImplementationPrompt('typescript', tools, code) as GetTypescriptToolImplementationPromptResponse;
    }
    
    public async getPythonToolImplementationPrompt(tools: string[] = [], code: string = ""): Promise<GetPythonToolImplementationPromptResponse> {
        return await this.getToolImplementationPrompt('python', tools, code) as GetPythonToolImplementationPromptResponse;
    }

    private async getToolImplementationPrompt(language: Language,tools: string[] = [], code: string = ""): Promise<GetTypescriptToolImplementationPromptResponse | GetPythonToolImplementationPromptResponse> {
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