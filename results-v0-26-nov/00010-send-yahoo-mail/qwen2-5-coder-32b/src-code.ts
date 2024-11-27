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