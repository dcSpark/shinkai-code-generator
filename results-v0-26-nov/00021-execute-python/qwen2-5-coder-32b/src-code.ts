import { execSync, spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

type CONFIG = {};
type INPUTS = { code: string, timeout_seconds?: number };
type OUTPUT = { result: string | null, error: string | null };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { code, timeout_seconds } = inputs;
    let result: string | null = null;
    let error: string | null = null;

    try {
        // Write the Python code to a temporary file
        const tempFilePath = './temp_python_script.py';
        Deno.writeTextFileSync(tempFilePath, code);

        // Prepare the execution command with timeout handling
        const pythonProcess = spawn('python', [tempFilePath], { stdio: ['pipe', 'pipe', 'pipe'] });

        let processCompleted = false;

        const timeoutPromise = (timeout_seconds ? setTimeout(timeout_seconds * 1000, 'Timed out') : Promise.resolve(null)) as Promise<unknown>;
        
        const executionPromise = new Promise<void>((resolve, reject) => {
            pythonProcess.stdout.on('data', data => result = data.toString());
            pythonProcess.stderr.on('data', data => error = data.toString());
            pythonProcess.on('close', () => { processCompleted = true; resolve(); });
            pythonProcess.on('error', err => { error = err.message; reject(err); });
        });

        await Promise.race([timeoutPromise, executionPromise]);

        if (!processCompleted) {
            pythonProcess.kill();
            throw new Error('Process timed out');
        }

        // Clean up the temporary file
        Deno.removeSync(tempFilePath);

    } catch (err: unknown) {
        error = err instanceof Error ? err.message : String(err);
    }

    return { result, error };
}