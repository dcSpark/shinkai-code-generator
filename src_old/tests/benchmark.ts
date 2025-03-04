import { tool_router_key } from "../test-engine/shinak-api.ts";
import { TestData } from "../support/types.ts";


// Python only test
 const test_python_hn = {
  skip: 'python-hn library broken',
  code: `benchmark-python-hn-topic`,
  prompt: `Generate a tool that fetches the top news using python-hn by topic. 
<python-hn documentation>
Install instructions
$ pip install python-hn

Usage
Check out Interactive Docs to try the library without installing it.

from hn import search_by_date

# Search everything (stories, comments, etc) containing the keyword 'python'
search_by_date('python')

# Search everything (stories, comments, etc) from author 'pg' and keyword 'lisp'
search_by_date('lisp', author='pg', created_at__lt='2018-01-01')

# Search only stories
search_by_date('lisp', author='pg', stories=True, created_at__lt='2018-01-01')

# Search stories *or* comments
search_by_date(q='lisp', author='pg', stories=True, comments=True, created_at__lt='2018-01-01')
</python-hn documentation>  
  `,
  prompt_type: "type INPUT = { topic: string }",
  inputs: { topic: "robotics" },
  tools: [],
  config: {},
  limited_language: "python",
};
const test_python_hn_date_range = {
  skip: 'python-hn library broken',
  code: `benchmark-python-hn-date-range`,
  prompt: `Generate a tool that fetches the top news using python-hn by topic and optional date range. 
<python-hn documentation>
Install instructions
$ pip install python-hn

Usage
Check out Interactive Docs to try the library without installing it.

from hn import search_by_date

# Search everything (stories, comments, etc) containing the keyword 'python'
search_by_date('python')

# Search everything (stories, comments, etc) from author 'pg' and keyword 'lisp'
search_by_date('lisp', author='pg', created_at__lt='2018-01-01')

# Search only stories
search_by_date('lisp', author='pg', stories=True, created_at__lt='2018-01-01')

# Search stories *or* comments
search_by_date(q='lisp', author='pg', stories=True, comments=True, created_at__lt='2018-01-01')
</python-hn documentation>  
  `,
  prompt_type: "type INPUT = { topic: string, created_at__lt?: string, created_at__gt?: string }",
  inputs: { topic: "robotics", created_at__gt: "2024-12-15" },
  tools: [],
  config: {},
  limited_language: "python",
};

// OAuth Test
const test_email_smtp = {
  code: `benchmark-email-smtp`,
  prompt: `Generate a tool that sends an email to a given email address using nodemailer.`,
  prompt_type: "type INPUT = { to: string, subject: string, body: string }",
  inputs: {
    to: "example@example.com",
    subject: "Test Email",
    body: "This is a test email.",
  },
  tools: [],
  config: {},
};
// const test_oauth_github = {
//   code: `benchmark-oauth-github`,
//   prompt: `Generate a tool that fetches the user profile from GitHub.`,
//   prompt_type: "type INPUT = {}",
//   inputs: {},
//   tools: [],
//   config: {},
// };
// OAuth Test Google Calendar
// const test_oauth_google_calendar = {
//   code: `benchmark-oauth-google-calendar`,
//   prompt: `Generate a tool that creates a event in Google Calendar.`,
//   prompt_type: "type INPUT = { event: string, description: string, start_iso: string, end_iso: string }",
//   inputs: {
//     event: "Test Event",
//     description: "Test Description",
//     start_iso: "2024-12-05T10:00:00",
//     end_iso: "2024-12-05T11:00:00",
//   },
//   tools: [],
//   config: {},
// };

// Tool with Config
const test_config = {
  code: `benchmark-config`,
  prompt: `Generate a tool that does this call: curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {config.api_key}" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "{input.prompt}"}]
  }'`,
  prompt_type: "type INPUT = { prompt: string }",
  inputs: { prompt: "2 + 2 = ?" },
  tools: [],
  config: { api_key: Deno.env.get("OPENAI_API_KEY") ?? "" },
};

// Test with a config & SQL
const test_config_sql = {
  code: `benchmark-config-sql`,
  prompt: `Generate a tool that does this call: curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {config.api_key}" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "{input.prompt}"}]
  }'. Store the result in a database.`,
  prompt_type: "type INPUT = { prompt: string }",
  inputs: { prompt: "2 + 2 = ?" },
  tools: [
    "local:::rust_toolkit:::shinkai_sqlite_query_executor",
  ],
  config: { api_key: Deno.env.get("OPENAI_API_KEY") ?? "" },
};


// Impossible to implement
const testNoTools = {
  code: `benchmark-impossible`,
  prompt:
    `Generate a tool that creates a post in Facebook, X/Twitter, Instagram and Reddit.`,
  prompt_type: "type INPUT = { title: string, content: string }",
  inputs: {
    title: "Test",
    content: "Test",
  },
  tools: [],
  config: {},
};
// File store
const test_pdf_store = {
  code: `benchmark-pdf-store`,
  prompt:
    `download a pdf from a URL, parse the PDF contents with "pdf-parse" and store the content in a file. Return the file path.`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/sample.pdf",
  },
  tools: [],
  config: {},
};
// File store
const test_file_store = {
  code: `benchmark-file-store`,
  prompt: `download a image URL and store it in a file. Return the file path.`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/Lenna.png",
  },
  tools: [],
  config: {},
};
const test_download_website = {
  code: `benchmark-download-website-md-with-tool`,
  prompt:
    `Generate a tool that downloads a website, converts their HTML content to Markdown and finally return the Markdown content as { content: string }.`,
  prompt_type: "type INPUT = { urls: string[] }",
  inputs: {
    urls: [
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
    ],
  },
  tools: ["local:::shinkai_tool_download_pages:::shinkai__download_pages"],
  config: {},
};
// This test downloads a website and returns the HTML as a string.
const test0 = {
  code: `benchmark-download-website`,
  prompt:
    `Generate a tool that downloads a website, and return the complete HTML as { content: string }.`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
  },
  tools: [],
  config: {},
  check: (result: string) => {
    return result.includes("This is a static site") ? 1 : 0;
  },
  save: true,
};
// This tests stores the website in a sqlite database.
const test1 = {
  code: `benchmark-store-website`,
  prompt:
    `Generate a tool that stores or updates a website content in a sqlite database, and returns the entire table`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
  },
  tools: [
    "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    tool_router_key(test0),
  ],
  config: {},
  check: (result: string) => {
    return result.includes("This is a static site") ? 1 : 0;
  },
  save: true,
};
// This test reads the website content from the sqlite database and generates a summary.
const test2 = {
  code: `benchmark-summarize-website`,
  prompt:
    `Generate a tool that reads the website content from the sqlite database and generates a summary.`,
  prompt_type: "type INPUT = { url: string }",
  inputs: {
    url:
      "https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html",
  },
  tools: [
    "local:::rust_toolkit:::shinkai_llm_prompt_processor",
    "local:::rust_toolkit:::shinkai_sqlite_query_executor",
    tool_router_key(test1),
  ],
  config: {},
  check: (result: string) => {
    return result.includes("static") ? 1 : 0;
  },
  save: true,
};
const basic_tool = {
  code: `benchmark-basic-tool`,
  prompt: `Generate a tool that calls a New foobar tool from template.`,
  prompt_type: "type INPUT = {}",
  inputs: {},
  tools: ["local:::shinkai_tool_foobar:::shinkai__foobar"],
  config: {},
};

export const benchmarkTests: TestData[] = [
  test_python_hn,
  test_python_hn_date_range,
  test_email_smtp,
  // test_oauth_github,
  // test_oauth_google_calendar,
  test_config,
  test_config_sql,
  test_pdf_store,
  test_file_store,
  test_download_website,
  basic_tool,
  test0,
  test1,
  test2,
  testNoTools,
];
