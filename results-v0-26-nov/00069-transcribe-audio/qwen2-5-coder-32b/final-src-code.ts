
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
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

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"audio_path":"/path/to/audio.mp3","language":"en","timestamps":true}')
  
  try {
    const program_result = await run({}, {"audio_path":"/path/to/audio.mp3","language":"en","timestamps":true});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

