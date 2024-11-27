
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import nodemailer from 'npm:nodemailer@6.9.1';
import * as fs from "https://deno.land/std@0.153.0/fs/mod.ts";
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type INPUTS = {
  to: string;
  subject: string;
  body: string;
  attachments?: string[];
};

type OUTPUT = {
  success: boolean;
  message: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  try {
    const { clientId, clientSecret, refreshToken } = config;
    const { to, subject, body, attachments } = inputs;

    // Fetch OAuth2 access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${await response.text()}`);
    }

    const { access_token } = await response.json();

    // Setup Nodemailer transport
    let transporter = nodemailer.createTransport({
      service: 'Yahoo',
      auth: {
        type: 'OAuth2',
        user: process.env.YAHOO_EMAIL,
        clientId: clientId,
        clientSecret: clientSecret,
        accessToken: access_token,
        refreshToken: refreshToken,
      },
    });

    // Prepare mail options
    let mailOptions = {
      from: process.env.YAHOO_EMAIL,
      to: to,
      subject: subject,
      html: body,
      attachments: attachments ? attachments.map(file => ({
        path: file,
      })) : [],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: `Failed to send email: ${error.message}` };
  }
}

  
  // console.log('Running...')
  // console.log('Config: {"requires_oauth":true,"oauth_scopes":["mail-w"]}')
  // console.log('Inputs: {"to":"recipient@example.com","subject":"Test Email","body":"Hello, this is a test email sent through Yahoo Mail!","attachments":["/path/to/file.pdf"]}')
  
  try {
    const program_result = await run({"requires_oauth":true,"oauth_scopes":["mail-w"]}, {"to":"recipient@example.com","subject":"Test Email","body":"Hello, this is a test email sent through Yahoo Mail!","attachments":["/path/to/file.pdf"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

