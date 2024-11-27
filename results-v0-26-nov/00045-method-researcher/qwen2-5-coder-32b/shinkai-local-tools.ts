
import axios from 'npm:axios';
// deno-lint-ignore no-explicit-any
const tryToParseError = (data: any) => { try { return JSON.stringify(data); } catch (_) { return data; } };
// deno-lint-ignore no-explicit-any
const manageAxiosError = (error: any) => {
    // axios error management
    let message = '::NETWORK_ERROR::';
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message += ' ' + tryToParseError(error.response.data);
        message += ' ' + tryToParseError(error.response.status);
        message += ' ' + tryToParseError(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message += ' ' + tryToParseError(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        message += ' ' + tryToParseError(error.message);
    }
    message += ' ' + tryToParseError(error.config);
    throw new Error(message);
};
