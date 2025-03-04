import { TestData } from "../support/types.ts";

export const communicationTests: TestData[] = [
  {
    code: `make-phone-call`,
    prompt:
      `Generate a tool that can make a phone call to a given number and play a message.`,
    prompt_type: "type INPUT = { phone_number: string, message: string }",
    inputs: {
      phone_number: "+1234567890",
      message: "Hi, how are you?",
    },
    tools: [],
    config: {},
  },
  {
    code: `send-sms`,
    prompt:
      `Generate a tool that can send an SMS message to a given phone number.`,
    prompt_type: "type INPUT = { phone_number: string, message: string }",
    inputs: {
      phone_number: "+1234567890",
      message: "Hello from SMS tool!",
    },
    tools: [],
    config: {},
  },
  {
    code: `send-whatsapp`,
    prompt:
      `Generate a tool that can send a WhatsApp message to a given phone number.`,
    prompt_type: "type INPUT = { phone_number: string, message: string }",
    inputs: {
      phone_number: "+1234567890",
      message: "Hello from WhatsApp tool!",
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
  },
  {
    code: `birthday-voice-call`,
    prompt:
      `Generate a tool that can make a voice call using a specified voice to say happy birthday.`,
    prompt_type:
      "type INPUT = { phone_number: string, name: string, voice_model_path: string }",
    inputs: {
      phone_number: "+1234567890",
      name: "John",
      voice_model_path: "/path/to/voice/model.wav",
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {},
  },
  {
    code: `send-gmail`,
    prompt:
      `Generate a tool that can send an email through Gmail using OAuth2 authentication.`,
    prompt_type:
      "type INPUT = { to: string, subject: string, body: string, attachments?: string[] }",
    inputs: {
      to: "recipient@example.com",
      subject: "Test Email",
      body: "Hello, this is a test email sent through Gmail!",
      attachments: ["/path/to/file.pdf"],
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {
      requires_oauth: true,
      oauth_scopes: ["https://www.googleapis.com/auth/gmail.send"],
    },
  },
  {
    code: `send-yahoo-mail`,
    prompt:
      `Generate a tool that can send an email through Yahoo Mail using OAuth2 authentication.`,
    prompt_type:
      "type INPUT = { to: string, subject: string, body: string, attachments?: string[] }",
    inputs: {
      to: "recipient@example.com",
      subject: "Test Email",
      body: "Hello, this is a test email sent through Yahoo Mail!",
      attachments: ["/path/to/file.pdf"],
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {
      requires_oauth: true,
      oauth_scopes: ["mail-w"],
    },
  },
  {
    code: `send-mailgun`,
    prompt: `Generate a tool that can send an email using the Mailgun API.`,
    prompt_type:
      "type INPUT = { to: string, subject: string, body: string, from: string, attachments?: string[] }",
    inputs: {
      to: "recipient@example.com",
      from: "sender@yourdomain.com",
      subject: "Test Email",
      body: "Hello, this is a test email sent through Mailgun!",
      attachments: ["/path/to/file.pdf"],
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {
      requires_api_key: true,
    },
  },
  {
    code: `send-sendgrid`,
    prompt: `Generate a tool that can send an email using the SendGrid API.`,
    prompt_type:
      "type INPUT = { to: string, subject: string, body: string, from: string, attachments?: string[] }",
    inputs: {
      to: "recipient@example.com",
      from: "verified_sender@yourdomain.com",
      subject: "Test Email",
      body: "Hello, this is a test email sent through SendGrid!",
      attachments: ["/path/to/file.pdf"],
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {
      requires_api_key: true,
    },
  },
  {
    code: `read-gmail`,
    prompt:
      `Generate a tool that can read emails from Gmail inbox, with options for filtering and searching.`,
    prompt_type: `type INPUT = { 
      query?: string, 
      max_results?: number, 
      include_attachments?: boolean,
      label?: string
    }`,
    inputs: {
      query: "is:unread from:important@example.com",
      max_results: 10,
      include_attachments: true,
      label: "INBOX",
    },
    tools: [
      "local:::shinkai_tool_playwright_example:::shinkai__playwright_example",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    ],
    config: {
      requires_oauth: true,
      oauth_scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
    },
  },
  {
    code: `read-yahoo-mail`,
    prompt:
      `Generate a tool that can read emails from Yahoo Mail inbox, with options for filtering and searching.`,
    prompt_type: `type INPUT = { 
      query?: string, 
      max_results?: number, 
      include_attachments?: boolean,
      folder?: string
    }`,
    inputs: {
      query: "from:important@example.com",
      max_results: 10,
      include_attachments: true,
      folder: "Inbox",
    },
    tools: [],
    config: {
      requires_oauth: true,
      oauth_scopes: ["mail-r"],
    },
  },
];
