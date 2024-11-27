
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { translation?: string; topic?: string };
type OUTPUT = {};

const BIBLE_VERSES: Array<{ verse: string, interpretation: string }> = [
    // Example verses and interpretations
    { verse: "John 3:16", interpretation: "This verse is a well-known summary of the Gospel, emphasizing faith in Jesus Christ for eternal life." },
    { verse: "Romans 8:28", interpretation: "It expresses assurance that God works all things together for good for those who love Him and are called according to His purpose." }
];

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { translation = 'KJV', topic } = inputs;
    
    // Filter verses by topic if provided
    let filteredVerses = BIBLE_VERSES;
    if (topic) {
        filteredVerses = BIBLE_VERSES.filter(verse => verse.verse.toLowerCase().includes(topic.toLowerCase()) || verse.interpretation.toLowerCase().includes(topic.toLowerCase()));
    }

    // Select a random verse from the filtered list
    const randomVerseIndex = Math.floor(Math.random() * filteredVerses.length);
    const selectedVerse = filteredVerses[randomVerseIndex];

    // Store the result in SQL
    await localRustToolkitShinkaiSqliteQueryExecutor(
        `INSERT INTO BibleVerses (verse, interpretation, translation) VALUES (?, ?, ?)`,
        [selectedVerse.verse, selectedVerse.interpretation, translation]
    );

    return {};
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"translation":"NIV","topic":"hope"}')
  
  try {
    const program_result = await run({}, {"translation":"NIV","topic":"hope"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

