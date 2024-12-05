
  // These environment variables are required, before any import.
  // Do not remove them, as they set environment variables for the Shinkai Tools.
  Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  Deno.env.set('BEARER', "debug");
  Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  Deno.env.set('HOME', "results/typescript/typescript-00004-benchmark-pdf-store/qwen2-5-coder-32b/editor/home");
  Deno.env.set('MOUNT', "results/typescript/typescript-00004-benchmark-pdf-store/qwen2-5-coder-32b/editor/mount");
  Deno.env.set('ASSETS', "results/typescript/typescript-00004-benchmark-pdf-store/qwen2-5-coder-32b/editor/assets");
  
import { Buffer } from 'node:buffer';
import { PDFParser } from 'npm:pdf-parse';
import { getHomePath } from './shinkai-local-support.ts';

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { filePath: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { url } = inputs;
  const response = await fetch(url);
  const data = new Uint8Array(await response.arrayBuffer());
  
  const pdfData = await PDFParser(Buffer.from(data));
  const textContent = pdfData.text;

  const homePath = getHomePath();
  const filePath = `${homePath}/parsed_pdf.txt`;

  await Deno.writeFile(filePath, new TextEncoder().encode(textContent));

  return { filePath };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"url":"https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/sample.pdf"}')
  
  try {
    const program_result = await run({}, {"url":"https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/sample.pdf"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

