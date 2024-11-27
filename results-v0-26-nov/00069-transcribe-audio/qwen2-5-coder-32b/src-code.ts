import { readFileSync } from 'node:fs';
import { createFFmpeg, fetchFile } from 'npm:@ffmpeg/ffmpeg@0.12.4';

type CONFIG = {};
type INPUTS = { audio_path: string, language?: string, timestamps?: boolean };
type OUTPUT = { text: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    // Write the input audio file to disk for ffmpeg to process
    ffmpeg.FS('writeFile', 'input_audio.mp3', readFileSync(inputs.audio_path));

    // Convert audio to text using whisper.cpp or a similar tool, here we use a placeholder command
    // Since whisper.cpp is not available in npm format and requires compilation, this part assumes it's compiled and accessible.
    // In practice, you would need to handle the whisper model loading and inference, possibly with a custom WASM build or server call.
    const whisperCommand = `whisper --model tiny input_audio.mp3`;
    
    if (inputs.timestamps) {
        ffmpeg.FS('writeFile', 'command.sh', new TextEncoder().encode(whisperCommand + " --output_format srt"));
    } else {
        ffmpeg.FS('writeFile', 'command.sh', new TextEncoder().encode(whisperCommand));
    }

    await ffmpeg.run('/bin/sh', '-c', 'command.sh');

    // Read the output file
    const data = ffmpeg.FS('readFile', inputs.timestamps ? 'input_audio.srt' : 'result.txt');
    const text = new TextDecoder().decode(data);

    return { text };
}