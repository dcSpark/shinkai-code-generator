import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { assertObjectMatch } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { router } from "../src/service.ts";
import { ShinkaiAPI } from "../src/ShinkaiPipeline/ShinkaiAPI.ts";
console.log(String(router)[0]); // so that {router} get loaded

// TODO All test should be in the same file for for prompt testing.
export class ServiceAPIBase {
    baseUrl = `http://localhost:8080`;
    uuid = new Date().getTime().toString() + '-' + Math.random().toString(36).substring(2, 15);

    code: string = '';
    tests: { input: Record<string, any>, config: Record<string, any>, output: Record<string, any> }[] = [];
    metadata: Record<string, any> = {};

    constructor() { }

    async startTest(prompt: string, language: "typescript" | "python", fileName: string, runTests: boolean = true) {

        {
            let response1 = await fetch(`${this.baseUrl}/generate`, {
                method: "POST",
                headers: {
                    "accept": "text/event-stream",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language,
                    prompt: prompt,
                    tool_type: "shinkai",
                    skipfeedback: "false",
                    x_shinkai_request_uuid: `test-${language === 'typescript' ? 'ts' : 'py'}-${this.uuid}`,
                    feedback: ""
                }),
            });

            assertEquals(response1.status, 200, 'response1.status');

            let reader1 = response1.body?.getReader();
            let decoder1 = new TextDecoder();
            let part1 = '';
            while (true) {
                const data = await reader1?.read();
                const partialResult = decoder1.decode(data?.value);
                console.log(partialResult);
                part1 += partialResult;
                if (data?.done) break;
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            reader1 = undefined as any;
            decoder1 = undefined as any;
            response1 = undefined as any;
            assertEquals(part1.includes('event: request-feedback'), true, 'part1.includes(request-feedback)');
        }
        {
            let response2 = await fetch(`${this.baseUrl}/generate`, {
                method: "POST",
                headers: {
                    "accept": "text/event-stream",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language,
                    prompt: 'ok',
                    tool_type: "shinkai",
                    skipfeedback: "false",
                    x_shinkai_request_uuid: `test-${language === 'typescript' ? 'ts' : 'py'}-${this.uuid}`,
                    feedback: ""
                }),
            });

            assertEquals(response2.status, 200, 'response2.status');

            let reader2 = response2.body?.getReader();
            let decoder2 = new TextDecoder();
            let part2 = '';
            while (true) {
                const data = await reader2?.read();
                const partialResult = decoder2.decode(data?.value);
                console.log(partialResult);
                part2 += partialResult;
                if (data?.done) break;
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            reader2 = undefined as any;
            decoder2 = undefined as any;
            response2 = undefined as any;

            assertEquals(part2.includes('event: code'), true, 'part2.includes(code)');

            const code = part2.split('event: code')[1].split('\n')[1].replace(/^data: /, '');
            assertEquals(code.includes('export async function run'), true, 'code.includes(export async function run)');

            this.code = JSON.parse(code).code;
            assertEquals(this.code.includes('export async function run'), true, 'code.includes(export async function run)');

            const tests = part2.split('event: tests')[1].split('\n')[1].replace(/^data: /, '');
            assertEquals(tests.includes('"input"'), true, 'tests.includes("input")');
            this.tests = JSON.parse(tests).tests;
            assertEquals(Array.isArray(this.tests), true, 'this.tests is an array');
            assertEquals(this.tests.length > 0, true, 'tests.length > 0');
        }

        {
            let response3 = await fetch(`${this.baseUrl}/metadata`, {
                method: "POST",
                headers: {
                    "accept": "text/event-stream",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: "typescript",
                    code: this.code,
                    x_shinkai_request_uuid: `test-${language === 'typescript' ? 'ts' : 'py'}-${this.uuid}`,
                }),
            });

            let reader3 = response3.body?.getReader();
            let decoder3 = new TextDecoder();
            let part3 = '';
            while (true) {
                const data = await reader3?.read();
                const partialResult = decoder3.decode(data?.value);
                console.log(partialResult);
                part3 += partialResult;
                if (data?.done) break;
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            reader3 = undefined as any;
            decoder3 = undefined as any;
            response3 = undefined as any;
            assertEquals(part3.includes('event: metadata'), true, 'part3.includes(metadata)');
            const metadata = part3.split('event: metadata')[1].split('\n')[1].replace(/^data: /, '');
            assertEquals(metadata.includes('name'), true, 'metadata.includes(name)');
            const jMetadata: { metadata: Record<string, any> } = JSON.parse(metadata);
            this.metadata = jMetadata.metadata;
        }

        const api = new ShinkaiAPI();
        for (const [index, test] of this.tests.entries()) {
            console.log('[Running Test] ' + (index + 1) + ' of ' + this.tests.length);
            console.log(this.code);
            console.log(this.metadata);
            console.log(test);
            if (runTests) {
                const result = await api.executeCode(this.code, this.metadata.tools, test.input, test.config, 'gpt-4o-mini');
                assertObjectMatch(result, test.output);
            }
        }

        Deno.writeTextFileSync(Deno.cwd() + '/test-results/' + fileName + (language === 'typescript' ? '.ts' : '.py'), this.code);
        Deno.writeTextFileSync(Deno.cwd() + '/test-results/' + fileName + '.metadata.json', JSON.stringify(this.metadata, null, 2));
    }
}
