```typescript
import nodemailer from 'npm:nodemailer@6.9.4';

type CONFIG = {};
type INPUTS = {
    landlord_email: string;
    property_address: string;
    desired_discount: number;
};
type OUTPUT = { success: boolean, message: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Assuming Gmail for this example
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: '"Your Name" <your-email@gmail.com>',
        to: inputs.landlord_email,
        subject: `Request for Discount on Property at ${inputs.property_address}`,
        text: `
Dear Landlord,

I hope this message finds you well. I am writing in regards to the property located at ${inputs.property_address}. As a tenant, I have been thoroughly enjoying my stay and would like to request your consideration for a discount of ${inputs.desired_discount}% on my rent.

Your understanding and support would be greatly appreciated as it will help me manage my financial situation more effectively.

Thank you for taking the time to read this request. I look forward to hearing from you soon.

Best regards,
[Your Full Name]
[Your Contact Information]
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        return { success: false, message: `Failed to send email. Error: ${error.message}` };
    }
}
```