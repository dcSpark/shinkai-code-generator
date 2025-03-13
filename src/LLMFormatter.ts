import { TestFileManager } from "./TestFileManager.ts";

type Extractor = 'markdown' | 'json' | 'typescript' | 'python' | 'none';
type Rules = { regex?: RegExp[], isJSONArray?: boolean, isJSONObject?: boolean };

export class LLMFormatter {
    constructor(private logger: TestFileManager | undefined) { }

    public async retryUntilSuccess(
        fn: () => Promise<string>,
        extractor: Extractor,
        expected: Rules): Promise<string> {
        let retries = 3;
        let lastFile = '';
        while (retries > 0) {
            try {
                lastFile = await fn();
                let extractIndex = 0;
                while (true) {
                    const partialResult = this.extract(extractor, lastFile, extractIndex);
                    if (!partialResult) {
                        throw new Error('Failed to extract. Rerun LLM Prompt.');
                    }
                    try {
                        const finalResult = await this.checkExtracted(partialResult, expected);
                        return finalResult;
                    } catch (e) {
                        await this.logger?.save(10000 + retries, `extraction_${extractIndex}`,
                            `Failed extraction ${extractIndex} : ${String(e)}\n\nOriginal Content:\n${lastFile || 'No last file'}\n\nExtracted Content:\n${partialResult}\n\nFunction Code:\n${fn.toString()}`,
                            'error.txt');
                        extractIndex++;
                    }
                }
            } catch (e) {
                await this.logger?.save(10000 + retries, 'retry',
                    JSON.stringify({
                        error: String(e),
                        file: lastFile || 'No file',
                        rules: extractor,
                        expected,
                        functionCode: fn.toString()
                    }, null, 2),
                    'error.json');
                retries--;
            }
        }
        await this.logger?.save(10000 + retries, 'final',
            JSON.stringify({
                file: lastFile || 'No file',
                rules: extractor,
                expected,
                functionCode: fn.toString(),
                extractorType: extractor
            }, null, 2),
            'failed_after_retries.json');
        throw new Error('Failed to get result after 3 retries')
    }

    private async checkExtracted(result: string, expected: Rules) {
        if (!result) {
            throw new Error('Empty result');
        }
        // Do checks
        if (expected.regex && !expected.isJSONArray) {
            for (const r of expected.regex) {
                if (!r.test(result)) {
                    await this.logger?.save(10000, 'regex_check',
                        JSON.stringify({
                            regex: String(r),
                            result,
                            expectedRules: expected
                        }, null, 2),
                        'format_mismatch.json');
                    throw new Error('Does not match format:' + String(r));
                }
            }
        }

        if (expected.isJSONArray) {
            const json = JSON.parse(result);
            if (!Array.isArray(json)) {
                throw new Error('Does not match format')
            }
            if (expected.regex) {
                for (const item of json) {
                    for (const r of expected.regex) {
                        if (!r.test(item)) {
                            throw new Error('Does not match format:' + String(r));
                        }
                    }
                }
            }
        }

        if (expected.isJSONObject) {
            const json = JSON.parse(result);
            if (typeof json !== 'object') {
                throw new Error('Does not match format')
            }
        }
        // All good, finish.
        return result
    }

    private extract(extractor: Extractor, result: string, index = 0) {
        switch (extractor) {
            case 'markdown':
                return this.tryToExtractMarkdown(result, index);
            case 'json':
                return this.tryToExtractJSON(result, index);
            case 'typescript':
                return this.tryToExtractTS(result, index);
            case 'python':
                return this.tryToExtractPython(result, index);
            case 'none':
                return result;
        }
    }

    private tryToExtractTS(text: string, index: number): string | undefined {
        // Capture outer block
        const regex = text.match(/```typescript/) ?
            /```typescript\n([\s\S]+?)\n```/g :
            /```(?:typescript)?\n([\s\S]+?)\n```/g;
        const match = text.match(regex);
        if (match && match[index]) {
            // Capture internal block
            const regex2 = text.match(/```typescript/) ?
                /```typescript\n([\s\S]+?)\n```/ :
                /```(?:typescript)?\n([\s\S]+?)\n```/;
            return match[index]?.match(regex2)?.[1];
        }
        return;
    }

    private tryToExtractPython(text: string, index: number): string | undefined {
        const regex = text.match(/```python/) ?
            /```python\n([\s\S]+?)\n```/g :
            /```(?:python)?\n([\s\S]+?)\n```/g;
        const match = text.match(regex);
        if (match && match[index]) {
            const regex2 = text.match(/```python/) ?
                /```python\n([\s\S]+?)\n```/ :
                /```(?:python)?\n([\s\S]+?)\n```/;
            return match[index]?.match(regex2)?.[1];
        }
        return;
    }

    private tryToExtractJSON(text: string, index: number): string | undefined {
        const regex = text.match(/```json/) ?
            /```json\n([\s\S]+?)\n```/g :
            /```(?:json)?\n([\s\S]+?)\n```/g;
        const match = text.match(regex);
        if (match && match[index]) {
            const regex2 = text.match(/```json/) ?
                /```json\n([\s\S]+?)\n```/ :
                /```(?:json)?\n([\s\S]+?)\n```/;
            return match[index]?.match(regex2)?.[1];
        }
        return;
    }

    private tryToExtractMarkdown(text: string, index: number): string | undefined {
        const regex = text.match(/```markdown/) ?
            /```markdown\n([\s\S]+?)\n```/g :
            /```(?:markdown)?\n([\s\S]+?)\n```/g;
        const match = text.match(regex);
        if (match && match[index]) {
            const regex2 = text.match(/```markdown/) ?
                /```markdown\n([\s\S]+?)\n```/ :
                /```(?:markdown)?\n([\s\S]+?)\n```/;
            return match[index]?.match(regex2)?.[1];
        }
        return;
    }
}

