```typescript
import { Buffer } from 'node:buffer';
import { PDFParser } from 'npm:pdf-parse';

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
```