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