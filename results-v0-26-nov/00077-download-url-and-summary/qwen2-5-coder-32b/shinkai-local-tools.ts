
import axios from 'npm:axios';
// deno-lint-ignore no-explicit-any
const tryToParseError = (data: any) => { try { return JSON.stringify(data); } catch (_) { return data; } };
// deno-lint-ignore no-explicit-any
const manageAxiosError = (error: any) => {
    // axios error management
    let message = '::NETWORK_ERROR::';
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message += ' ' + tryToParseError(error.response.data);
        message += ' ' + tryToParseError(error.response.status);
        message += ' ' + tryToParseError(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message += ' ' + tryToParseError(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        message += ' ' + tryToParseError(error.message);
    }
    message += ' ' + tryToParseError(error.config);
    throw new Error(message);
};
/**
 * Downloads one or more URLs and converts their HTML content to Markdown
 * @param urls - (required) 
 * @returns {
 *   markdowns: string[] 
 * }
 */
export async function shinkaiDownloadPages(urls: any[]): Promise<{
    markdowns: string[];
}> {
    const _url = `${Deno.env.get('SHINKAI_NODE_LOCATION')}/v2/tool_execution`;    const data = {
        tool_router_key: 'local:::shinkai_tool_download_pages:::shinkai__download_pages',
        tool_type: 'deno',
        llm_provider: `${Deno.env.get('X_SHINKAI_LLM_PROVIDER')}`,
        parameters: {
            urls: urls,
        },
    };
    try {
    const response = await axios.post(_url, data, {
        headers: {
            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,
            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,
            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`,
            'x-shinkai-llm-provider': `${Deno.env.get('X_SHINKAI_LLM_PROVIDER')}`
        }
    });
    return response.data;
    } catch (error) {
        return manageAxiosError(error);
    }
}

/**
 * Tool for processing any prompt using an AI LLM. 
Analyzing the input prompt and returning a string with the result of the prompt.
This can be used to process complex requests, text analysis, text matching, text generation, and any other AI LLM task.
 * @param format - (required, The output format. Only 'text' is supported) 
 * @param prompt - (required, The prompt to process) 
 * @returns {
 *   message: string 
 * }
 */
export async function shinkaiLlmPromptProcessor(format: string, prompt: string): Promise<{
    message: string;
}> {
    const _url = `${Deno.env.get('SHINKAI_NODE_LOCATION')}/v2/tool_execution`;    const data = {
        tool_router_key: 'local:::rust_toolkit:::shinkai_llm_prompt_processor',
        tool_type: 'rust',
        llm_provider: `${Deno.env.get('X_SHINKAI_LLM_PROVIDER')}`,
        parameters: {
            format: format,
            prompt: prompt,
        },
    };
    try {
    const response = await axios.post(_url, data, {
        headers: {
            'Authorization': `Bearer ${Deno.env.get('BEARER')}`,
            'x-shinkai-tool-id': `${Deno.env.get('X_SHINKAI_TOOL_ID')}`,
            'x-shinkai-app-id': `${Deno.env.get('X_SHINKAI_APP_ID')}`,
            'x-shinkai-llm-provider': `${Deno.env.get('X_SHINKAI_LLM_PROVIDER')}`
        }
    });
    return response.data;
    } catch (error) {
        return manageAxiosError(error);
    }
}

