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