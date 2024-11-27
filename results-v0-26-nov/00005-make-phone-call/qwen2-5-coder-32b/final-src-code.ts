
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
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

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"phone_number":"+1234567890","message":"Hi, how are you?"}')
  
  try {
    const program_result = await run({}, {"phone_number":"+1234567890","message":"Hi, how are you?"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

