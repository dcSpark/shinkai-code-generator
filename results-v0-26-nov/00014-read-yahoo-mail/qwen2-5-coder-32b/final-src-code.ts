
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { createClient } from 'npm:imap@0.8.19';
import * as MailParser from 'npm:mailparser@3.2.0';

type CONFIG = {};
type INPUTS = {
  query?: string;
  max_results?: number;
  include_attachments?: boolean;
  folder?: string;
};
type OUTPUT = {
  emails: any[];
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { query = '', max_results = 10, include_attachments = false, folder = 'INBOX' } = inputs;

  return new Promise((resolve, reject) => {
    const client = createClient({
      user: process.env.YAHOO_EMAIL,
      password: process.env.YAHOO_PASSWORD,
      host: 'imap.mail.yahoo.com',
      port: 993,
      tls: true
    });

    let emails: any[] = [];

    client.once('ready', () => {
      client.openBox(folder, true, (err, box) => {
        if (err) return reject(err);

        const searchCriteria: any[] = ['ALL'];
        if (query) {
          searchCriteria.push(['SUBJECT', query], ['BODY', query]);
        }

        const fetchOptions: any = { bodies: '' };
        if (!include_attachments) {
          fetchOptions.markSeen = true;
        } else {
          fetchOptions.struct = true;
        }

        client.search(searchCriteria, (err, results) => {
          if (err || !results.length) return reject(err);

          const f = client.fetch(results.slice(0, max_results), fetchOptions);
          f.on('message', (msg, seqno) => {
            const prefix = '(#' + seqno + ') ';
            msg.on('body', (stream, info) => {
              MailParser.simpleParser(stream, async (err, mailObject) => {
                if (err) return reject(err);

                let emailData = {
                  subject: mailObject.subject,
                  from: mailObject.from.text,
                  to: mailObject.to ? mailObject.to.text : '',
                  date: mailObject.date,
                  text: mailObject.text,
                  html: mailObject.html
                };

                if (include_attachments) {
                  emailData['attachments'] = mailObject.attachments.map((attachment: any) => ({
                    filename: attachment.filename,
                    content: await attachment.content.toString()
                  }));
                }

                emails.push(emailData);
              });
            });

            msg.once('end', () => console.log(prefix + 'Finished'));
          });

          f.once('error', reject);
          f.once('end', () => {
            client.end();
            resolve({ emails });
          });
        });
      });
    });

    client.once('error', reject);

    client.once('end', () => {
      console.log('Connection ended');
    });

    client.connect();
  });
}

  
  // console.log('Running...')
  // console.log('Config: {"requires_oauth":true,"oauth_scopes":["mail-r"]}')
  // console.log('Inputs: {"query":"from:important@example.com","max_results":10,"include_attachments":true,"folder":"Inbox"}')
  
  try {
    const program_result = await run({"requires_oauth":true,"oauth_scopes":["mail-r"]}, {"query":"from:important@example.com","max_results":10,"include_attachments":true,"folder":"Inbox"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

