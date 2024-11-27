import axios from 'npm:axios@1.6.2';

type CONFIG = {};
type INPUTS = { phone_number: string, message: string };
type OUTPUT = { success: boolean, message?: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    try {
        // Assuming a WhatsApp Business API endpoint is used for sending messages
        const whatsappApiUrl = 'https://example.com/send'; // Replace with actual API URL
        const apiKey = 'your_api_key_here'; // Replace with actual API key

        const response = await axios.post(whatsappApiUrl, {
            phone_number: inputs.phone_number,
            message: inputs.message
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.status === "success") {
            return { success: true };
        } else {
            return { success: false, message: response.data.message || "Unknown error" };
        }
    } catch (error) {
        return { success: false, message: error.message || "An error occurred while sending the message." };
    }
}