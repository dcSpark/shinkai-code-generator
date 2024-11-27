import { TestData } from "../types.ts";

export const productivityTests: TestData[] = [
  {
    code: `todo-list-manager`,
    prompt:
      `Generate a tool that can create and manage a categorized todo list with reminders.`,
    prompt_type:
      "type INPUT = { tasks: Array<{title: string, category: string, due_date: string}> }",
    inputs: {
      tasks: [
        {
          title: "Complete project proposal",
          category: "work",
          due_date: "2024-04-01",
        },
        {
          title: "Buy groceries",
          category: "personal",
          due_date: "2024-03-25",
        },
      ],
    },
    tools: [],
    config: {},
  },
  {
    code: `team-manager-assistant`,
    prompt:
      `Generate a tool that can help manage teams with inspirational leadership.`,
    prompt_type:
      "type INPUT = { team_size: number, project_type: string, management_style: string }",
    inputs: {
      team_size: 5,
      project_type: "software development",
      management_style: "agile",
    },
    tools: [],
    config: {},
  },
  {
    code: `calendar-birthday-check`,
    prompt: `Generate a tool that can check a calendar for upcoming birthdays.`,
    prompt_type: "type INPUT = { calendar_id: string, days_ahead: number }",
    inputs: {
      calendar_id: "primary",
      days_ahead: 30,
    },
    tools: [],
    config: {},
  },
  {
    code: `powerpoint-creator`,
    prompt:
      `Generate a tool that can create a PowerPoint presentation about a given topic.`,
    prompt_type:
      "type INPUT = { topic: string, slides_count: number, style: string }",
    inputs: {
      topic: "Climate Change",
      slides_count: 10,
      style: "professional",
    },
    tools: [],
    config: {},
  },
];
