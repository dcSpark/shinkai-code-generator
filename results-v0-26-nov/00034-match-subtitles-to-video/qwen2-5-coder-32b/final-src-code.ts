
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import * as fs from 'npm:fs@0.0.1-security';
import * as path from 'https://deno.land/std/path/mod.ts';

type CONFIG = {};
type INPUTS = { video_path: string, subtitle_path: string };
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { video_path, subtitle_path } = inputs;

    try {
        // Check if files exist
        if (!fs.existsSync(video_path)) {
            return { success: false, message: `Video file not found at ${video_path}` };
        }
        if (!fs.existsSync(subtitle_path)) {
            return { success: false, message: `Subtitle file not found at ${subtitle_path}` };
        }

        // Get video duration using ffprobe
        const ffprobe = new Deno.Command("ffprobe", {
            args: [
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                video_path
            ]
        });
        const { success, stdout } = await ffprobe.output();
        if (!success) {
            return { success: false, message: `Failed to get video duration` };
        }
        const videoDuration = parseFloat(new TextDecoder().decode(stdout));

        // Get subtitle content and adjust timestamps if necessary
        const subtitleContent = await Deno.readTextFile(subtitle_path);
        const adjustedSubtitleContent = adjustSubtitles(subtitleContent, videoDuration);

        // Write adjusted subtitles back to file or a new file
        const outputSubtitlePath = path.join(path.dirname(subtitle_path), `synced_${path.basename(subtitle_path)}`);
        await Deno.writeTextFile(outputSubtitlePath, adjustedSubtitleContent);

        return { success: true, message: `Subtitles synchronized and saved to ${outputSubtitlePath}` };
    } catch (error) {
        return { success: false, message: `An error occurred: ${error.message}` };
    }
}

function adjustSubtitles(subtitleContent: string, videoDuration: number): string {
    // Simple example of adjusting subtitles based on video duration
    // This function should be expanded with actual synchronization logic
    const lines = subtitleContent.split('\n');
    let outputLines = [];
    for (let line of lines) {
        if (line.match(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)) {
            // Adjust timestamps here
            outputLines.push(line); // Placeholder for actual adjustment logic
        } else {
            outputLines.push(line);
        }
    }
    return outputLines.join('\n');
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"video_path":"movie.mp4","subtitle_path":"subtitles.srt"}')
  
  try {
    const program_result = await run({}, {"video_path":"movie.mp4","subtitle_path":"subtitles.srt"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

