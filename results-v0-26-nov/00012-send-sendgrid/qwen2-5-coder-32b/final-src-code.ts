
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import sgMail from 'npm:@sendgrid/mail@7.6.0';
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {
    sendGridApiKey: string;
    sqliteDbPath: string;
};

type INPUTS = {
    to: string;
    subject: string;
    body: string;
    from: string;
    attachments?: string[];
};

type OUTPUT = {
    success: boolean;
    message: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    try {
        sgMail.setApiKey(config.sendGridApiKey);

        const msg = {
            to: inputs.to,
            from: inputs.from,
            subject: inputs.subject,
            text: inputs.body,
            html: `<p>${inputs.body}</p>`,
            attachments: inputs.attachments?.map(filename => ({
                content: await Deno.readTextFile(filename),
                filename: filename.split('/').pop(),
                type: 'application/pdf', // Adjust type as necessary
                disposition: 'attachment'
            }))
        };

        const [response] = await sgMail.send(msg);

        if (response[0].statusCode === 202) {
            await localRustToolkitShinkaiSqliteQueryExecutor(config.sqliteDbPath, `
                INSERT INTO emails (to_address, subject, body, from_address, status)
                VALUES (?, ?, ?, ?, ?);
            `, [inputs.to, inputs.subject, inputs.body, inputs.from, 'sent']);
            return { success: true, message: 'Email sent successfully.' };
        } else {
            await localRustToolkitShinkaiSqliteQueryExecutor(config.sqliteDbPath, `
                INSERT INTO emails (to_address, subject, body, from_address, status)
                VALUES (?, ?, ?, ?, ?);
            `, [inputs.to, inputs.subject, inputs.body, inputs.from, 'failed']);
            return { success: false, message: `Failed to send email. Status code: ${response[0].statusCode}` };
        }
    } catch (error) {
        await localRustToolkitShinkaiSqliteQueryExecutor(config.sqliteDbPath, `
            INSERT INTO emails (to_address, subject, body, from_address, status)
            VALUES (?, ?, ?, ?, ?);
        `, [inputs.to, inputs.subject, inputs.body, inputs.from, 'error']);
        return { success: false, message: `Error sending email: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {"requires_api_key":true}')
  // console.log('Inputs: {"to":"recipient@example.com","from":"verified_sender@yourdomain.com","subject":"Test Email","body":"Hello, this is a test email sent through SendGrid!","attachments":["/path/to/file.pdf"]}')
  
  try {
    const program_result = await run({"requires_api_key":true}, {"to":"recipient@example.com","from":"verified_sender@yourdomain.com","subject":"Test Email","body":"Hello, this is a test email sent through SendGrid!","attachments":["/path/to/file.pdf"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

