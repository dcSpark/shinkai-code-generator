import axios from 'npm:axios@1.6.2';

type CONFIG = {
  smsApiUrl: string;
  apiKey: string;
};

type INPUTS = {
  phone_number: string;
  message: string;
};

type OUTPUT = {
  success: boolean;
  message?: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  try {
    const response = await axios.post(
      config.smsApiUrl,
      {
        to: inputs.phone_number,
        message: inputs.message,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: response.data.message || 'Failed to send SMS' };
    }
  } catch (error) {
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
}