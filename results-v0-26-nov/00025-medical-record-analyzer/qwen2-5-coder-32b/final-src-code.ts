
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {
    databasePath: string;
};

type INPUTS = {
    records: Array<{ date: string, symptoms: string[], diagnosis?: string }>;
};

type OUTPUT = {
    suggestedDiagnoses: Array<{
        date: string,
        symptoms: string[],
        possibleDiagnoses: string[],
        solutions: string[]
    }>
};

const symptomToDiagnosisMap: { [key: string]: { diagnoses: string[], solutions: string[] } } = {
    "fever": { diagnoses: ["Infection", "Flu"], solutions: ["Rest", "Hydrate", "Over-the-counter pain relievers"] },
    "cough": { diagnoses: ["Cold", "Bronchitis"], solutions: ["Stay hydrated", "Use a humidifier", "Cough suppressants"] },
    "headache": { diagnoses: ["Tension headache", "Migraine"], solutions: ["Hydrate", "Rest in a dark room", "Pain relievers"] }
    // Add more mappings as needed
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const suggestedDiagnoses = inputs.records.map(record => {
        const symptomsSet = new Set(record.symptoms);
        let possibleDiagnoses = new Set<string>();
        let solutions = new Set<string>();

        record.symptoms.forEach(symptom => {
            if (symptomToDiagnosisMap[symptom]) {
                symptomToDiagnosisMap[symptom].diagnoses.forEach(diagnosis => possibleDiagnoses.add(diagnosis));
                symptomToDiagnosisMap[symptom].solutions.forEach(solution => solutions.add(solution));
            }
        });

        return {
            date: record.date,
            symptoms: Array.from(symptomsSet),
            possibleDiagnoses: Array.from(possibleDiagnoses),
            solutions: Array.from(solutions)
        };
    });

    // Optionally, store the suggested diagnoses in a local SQLite database
    const dbPath = config.databasePath;
    await localRustToolkitShinkaiSqliteQueryExecutor(dbPath, `
        CREATE TABLE IF NOT EXISTS suggested_diagnoses (
            date TEXT,
            symptoms TEXT,
            possibleDiagnoses TEXT,
            solutions TEXT
        )
    `);

    for (const diagnosis of suggestedDiagnoses) {
        await localRustToolkitShinkaiSqliteQueryExecutor(dbPath, `
            INSERT INTO suggested_diagnoses (date, symptoms, possibleDiagnoses, solutions)
            VALUES (?, ?, ?, ?)
        `, [
            diagnosis.date,
            JSON.stringify(diagnosis.symptoms),
            JSON.stringify(diagnosis.possibleDiagnoses),
            JSON.stringify(diagnosis.solutions)
        ]);
    }

    return { suggestedDiagnoses };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"records":[{"date":"2024-01-15","symptoms":["headache","fatigue"],"diagnosis":"migraine"}]}')
  
  try {
    const program_result = await run({}, {"records":[{"date":"2024-01-15","symptoms":["headache","fatigue"],"diagnosis":"migraine"}]});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

