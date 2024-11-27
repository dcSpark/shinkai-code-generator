import twilio from 'npm:twilio@3.84.5';

type CONFIG = {
    accountSid: string;
    authToken: string;
};

type INPUTS = {
    phone_number: string;
    message: string;
};

type OUTPUT = {
    call_sid?: string;
    error?: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const client = twilio(config.accountSid, config.authToken);
    try {
        const call = await client.calls.create({
            to: inputs.phone_number,
            from: '+1234567890', // Replace with your Twilio number
            url: `http://demo.twimlbin.com/message?Message=${encodeURIComponent(inputs.message)}`
        });
        return { call_sid: call.sid };
    } catch (error) {
        return { error: error.message };
    }
}