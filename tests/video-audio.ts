import { TestData } from "../types.ts";

export const videoAudioTests: TestData[] = [
  {
    code: `download-youtube`,
    prompt: `Create a tool that downloads a video from YouTube given a URL.`,
    prompt_type:
      "type INPUT = { url: string, quality?: 'highest' | 'lowest' | '1080p' | '720p' | '480p' | '360p' }",
    inputs: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      quality: "720p",
    },
    tools: [
      "local:::shinkai_tool_playwright_example:::shinkai__playwright_example",
    ],
    config: {},
  },
  {
    code: `video-to-audio`,
    prompt: `Create a tool that converts a video file to an audio file.`,
    prompt_type:
      "type INPUT = { video_path: string, output_format?: 'mp3' | 'wav' | 'aac' | 'm4a', bitrate?: string }",
    inputs: {
      video_path: "/path/to/video.mp4",
      output_format: "mp3",
      bitrate: "192k",
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
  },
  {
    code: `transcribe-audio`,
    prompt: `Create a tool that transcribes audio to text.`,
    prompt_type:
      "type INPUT = { audio_path: string, language?: string, timestamps?: boolean }",
    inputs: {
      audio_path: "/path/to/audio.mp3",
      language: "en",
      timestamps: true,
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "@@agent_provider_arb_sep_shinkai:::shinkai_tool_youtube_transcript:::youtube_transcript_with_timestamps",
    ],
    config: {},
  },
];
