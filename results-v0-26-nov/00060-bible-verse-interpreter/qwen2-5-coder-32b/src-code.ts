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