
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import nodemailer from 'npm:nodemailer@6.9.1';
import { google } from 'npm:googleapis@103.0.0';

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
  const { clientId, clientSecret, refreshToken } = config;
  const { to, subject, body, attachments } = inputs;

  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'your-email@gmail.com', // Replace with your email
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    const mailOptions = {
      from: '"Your Name" <your-email@gmail.com>', // Replace with your name and email
      to,
      subject,
      text: body,
      attachments: attachments?.map(filename => ({ path: filename })),
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    /* Error handling */
    return { success: false, message: `Error sending email: ${error.message}` };
  }
}

  
  // console.log('Running...')
  // console.log('Config: {"requires_oauth":true,"oauth_scopes":["https://www.googleapis.com/auth/gmail.send"]}')
  // console.log('Inputs: {"to":"recipient@example.com","subject":"Test Email","body":"Hello, this is a test email sent through Gmail!","attachments":["/path/to/file.pdf"]}')
  
  try {
    const program_result = await run({"requires_oauth":true,"oauth_scopes":["https://www.googleapis.com/auth/gmail.send"]}, {"to":"recipient@example.com","subject":"Test Email","body":"Hello, this is a test email sent through Gmail!","attachments":["/path/to/file.pdf"]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

