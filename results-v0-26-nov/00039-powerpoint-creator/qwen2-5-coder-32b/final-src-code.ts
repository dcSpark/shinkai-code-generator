
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { PptxGenJS } from 'npm:pptxgenjs@3.14.0';

type CONFIG = {};
type INPUTS = { topic: string, slides_count: number, style: string };
type OUTPUT = { filePath: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { topic, slides_count, style } = inputs;

    // Initialize PptxGenJS
    const pptx = new PptxGenJS();

    // Set presentation level settings based on style (basic implementation)
    if (style === 'dark') {
        pptx.layout = 'LAYOUT_WIDE';
        pptx.slideMaster.back = { fill: { color: '000000' } };
        pptx.defFontColor = 'FFFFFF';
    } else {
        pptx.layout = 'LAYOUT_4x3';
        pptx.slideMaster.back = { fill: { color: 'FFFFFF' } };
        pptx.defFontColor = '000000';
    }

    // Add title slide
    const titleSlideLayout = pptx.addSlide({ masterName: 'Title Slide', objects: [
        { text: topic, options: { x: 1, y: 2, w: 8, h: 1, fontSize: 48, bold: true } }
    ]});

    // Add content slides
    for (let i = 1; i < slides_count; i++) {
        const slide = pptx.addSlide();
        slide.addText(`Content for Slide ${i}`, { x: 1, y: 2, w: 8, h: 5, fontSize: 36 });
    }

    // Save the presentation
    const filePath = `./${topic.replace(/\s+/g, '_')}_presentation.pptx`;
    await pptx.writeFile({ fileName: filePath });

    return { filePath };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"topic":"Climate Change","slides_count":10,"style":"professional"}')
  
  try {
    const program_result = await run({}, {"topic":"Climate Change","slides_count":10,"style":"professional"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

