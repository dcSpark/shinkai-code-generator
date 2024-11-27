import { TestData } from "../types.ts";

export const securityTests: TestData[] = [
  {
    code: `security-video-analysis`,
    prompt:
      `Generate a tool that can analyze security camera video streams to detect intruders.`,
    prompt_type:
      "type INPUT = { video_stream_url: string, sensitivity?: number }",
    inputs: {
      video_stream_url: "rtsp://camera.local/stream1",
      sensitivity: 0.8,
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor"
    ],
    config: {},
  },
  {
    code: `litterbox-monitor`,
    prompt:
      `Generate a tool that can analyze cat litter box images to determine cleanliness and fullness.`,
    prompt_type:
      "type INPUT = { camera_feed: string, check_interval_minutes: number }",
    inputs: {
      camera_feed: "http://camera.local/litterbox",
      check_interval_minutes: 30,
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::shinkai_tool_playwright_example:::shinkai__playwright_example"
    ],
    config: {},
  },
  {
    code: `env-var-analyzer`,
    prompt:
      `Generate a tool that can analyze and explain environment variables.`,
    prompt_type:
      "type INPUT = { env_file_path?: string, include_system_vars?: boolean }",
    inputs: {
      env_file_path: ".env",
      include_system_vars: true,
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor"
    ],
    config: {},
  },
];
