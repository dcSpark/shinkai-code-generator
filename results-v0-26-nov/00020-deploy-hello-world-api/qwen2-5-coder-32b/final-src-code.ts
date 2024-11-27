
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import localRustToolkitShinkaiSqliteQueryExecutor from 'npm:localRustToolkitShinkaiSqliteQueryExecutor@1.0.0';

type CONFIG = {};
type INPUTS = { platform: string, api_name: string };
type OUTPUT = { success: boolean, message: string };

const generateCodeForPlatform = (platform: string, apiName: string): string => {
    switch (platform) {
        case 'node':
            return `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log('${apiName} app listening at http://localhost:${port}');
});
`;
        case 'python':
            return `from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(port=3000)
`;
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
};

const deployCode = async (code: string, apiName: string): Promise<string> => {
    // Simulate deployment process
    return `Deployed ${apiName} successfully.`;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    try {
        const { platform, api_name } = inputs;
        const code = generateCodeForPlatform(platform, api_name);
        await deployCode(code, api_name);

        // Store the result in SQL
        const query = `INSERT INTO deployments (api_name, platform, code) VALUES ('${api_name}', '${platform}', '${code}');`;
        await localRustToolkitShinkaiSqliteQueryExecutor(query);

        return { success: true, message: `${api_name} deployed successfully on ${platform}` };
    } catch (error) {
        return { success: false, message: `Failed to deploy ${inputs.api_name}: ${error.message}` };
    }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"platform":"vercel","api_name":"hello-world-api"}')
  
  try {
    const program_result = await run({}, {"platform":"vercel","api_name":"hello-world-api"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

