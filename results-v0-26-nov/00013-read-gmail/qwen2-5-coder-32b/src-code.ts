import { google } from 'npm:googleapis@108.0.0';
import { JWT } from 'npm:google-auth-library@9.0.0';

type CONFIG = {
  clientId: string;
  clientEmail: string;
  privateKey: string;
};

type INPUTS = { 
  query?: string; 
  max_results?: number; 
  include_attachments?: boolean;
  label?: string
};

type OUTPUT = {
  emails: Array<{
    id: string,
    subject: string,
    from: string,
    date: string,
    snippet: string,
    attachments: Array<{
      filename: string,
      content: string | null // base64 encoded content
    }> | null
  }>;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { clientId, clientEmail, privateKey } = config;
  const { query, max_results = 10, include_attachments = false, label } = inputs;

  // Set up Google JWT authentication
  const auth = new JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    clientId: clientId
  });

  // Initialize Gmail API
  const gmail = google.gmail({ version: 'v1', auth });
  
  let labelId = 'INBOX';
  if (label) {
    const labelsResponse = await gmail.users.labels.list({
      userId: 'me',
    });
    const labels = labelsResponse.data.labels || [];
    const targetLabel = labels.find(l => l.name === label);
    if (targetLabel) {
      labelId = targetLabel.id!;
    } else {
      throw new Error(`Label ${label} not found`);
    }
  }

  // Get messages list
  let q = `in:${labelId}`;
  if (query) {
    q += ` ${query}`;
  }
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: q,
    maxResults: max_results,
  });

  const emails: OUTPUT['emails'] = [];

  for (const message of response.data.messages || []) {
    const msgResponse = await gmail.users.messages.get({
      userId: 'me',
      id: message.id!,
      format: include_attachments ? 'full' : 'metadata'
    });
    
    const msgData = msgResponse.data;
    let subject = '';
    let from = '';
    let date = '';
    for (const header of msgData.payload?.headers || []) {
      if (header.name === 'Subject') subject = header.value!;
      if (header.name === 'From') from = header.value!;
      if (header.name === 'Date') date = new Date(header.value!).toDateString();
    }

    let attachments: Array<{ filename: string, content: string | null }> | null = null;
    if (include_attachments && msgData.payload?.parts) {
      attachments = [];
      for (const part of msgData.payload.parts) {
        if (part.filename && part.body?.attachmentId) {
          const attachmentResponse = await gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: message.id!,
            id: part.body.attachmentId
          });
          attachments.push({ filename: part.filename, content: attachmentResponse.data.data });
        }
      }
    }

    emails.push({
      id: msgData.id!,
      subject,
      from,
      date,
      snippet: msgData.snippet || '',
      attachments
    });
  }

  return { emails };
}