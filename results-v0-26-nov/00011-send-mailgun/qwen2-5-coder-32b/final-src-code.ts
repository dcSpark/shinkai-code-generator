
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import axios from 'npm:axios@1.6.2';

type CONFIG = {
  apiKey: string;
  domain: string;
};

type INPUTS = {
  to: string;
  subject: string;
  body: string;
  from: string;
  attachments?: string[];
};

type OUTPUT = {
  status: number;
  message: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { apiKey, domain } = config;
  const { to, subject, body, from, attachments } = inputs;

  try {
    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', body);

    if (attachments) {
      for (const attachment of attachments) {
        formData.append('attachment', await Deno.readFile(attachment), { filename: attachment.split('/').pop() });
      }
    }

    const response = await axios.post(
      `https://api.mailgun.net/v3/${domain}/messages`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...formData.getHeaders()
        },
        maxBodyLength: Infinity
      }
    );

    return { status: response.status, message: response.statusText };
  } catch (error) {
    return { status: error.response?.status || 500, message: error.message };
  }
}

  
  // console.log('Running...')
  // console.log('Config: {"requires_api_key":true}')
  // console.log('Inputs: {"to":"recipient@example.com","from":"sender@yourdomain.com","subject":"Test Email","body":"Hello, this is a test email sent through Mailgun!","attachments":["/path/to/file.pdf"]}')
  
  try {
    const program_result = await run({"requires_api_key":true}, {"to":"recipient@example.com","from":"sender@yourdomain.com","subject":"Test Email","body":"Hello, this is a test email sent through Mailgun!","attachments":["/path/to/file.pdf"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

