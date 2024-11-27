import { TestData } from "../types.ts";

export const mediaTests: TestData[] = [
  {
    code: `text-to-speech`,
    prompt: `Generate a tool that can convert a text to speech.`,
    prompt_type: "type INPUT = { text: string }",
    inputs: {
      text: "Hello, how are you?",
    },
    tools: [],
    config: {},
  },
  {
    code: `speech-to-text`,
    prompt: `Generate a tool that can convert a speech to text.`,
    prompt_type: "type INPUT = { file_path: string }",
    inputs: {
      file_path: "data.mp3",
    },
    tools: [],
    config: {},
  },
  {
    code: `create-video-subtitles`,
    prompt:
      `Generate a tool that can create subtitles for a video file using speech recognition.`,
    prompt_type: "type INPUT = { video_path: string }",
    inputs: {
      video_path: "video.mp4",
    },
    tools: [],
    config: {},
  },
  {
    code: `match-subtitles-to-video`,
    prompt:
      `Generate a tool that can synchronize subtitle files with a video file.`,
    prompt_type: "type INPUT = { video_path: string, subtitle_path: string }",
    inputs: {
      video_path: "movie.mp4",
      subtitle_path: "subtitles.srt",
    },
    tools: [],
    config: {},
  },
  {
    code: `create-podcast`,
    prompt:
      `Generate a tool that can create a podcast episode about a specific topic.`,
    prompt_type:
      "type INPUT = { topic: string, duration_minutes: number, style: string }",
    inputs: {
      topic: "Future of AI",
      duration_minutes: 30,
      style: "conversational",
    },
    tools: [],
    config: {},
  },
];
