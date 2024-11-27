```typescript
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
```