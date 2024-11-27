
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { 
  topic: string,
  current_skill_level?: "beginner" | "intermediate" | "advanced",
  time_available_hours?: number,
  learning_style?: "visual" | "auditory" | "reading" | "kinesthetic"
};
type OUTPUT = {
  plan: string[]
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { topic, current_skill_level = 'beginner', time_available_hours = 10, learning_style = 'reading' } = inputs;

  let plan: string[] = [];

  // Determine the base resources based on learning style
  let resources: string[];
  switch (learning_style) {
    case 'visual':
      resources = ['videos', 'infographics'];
      break;
    case 'auditory':
      resources = ['podcasts', 'lectures'];
      break;
    case 'reading':
      resources = ['books', 'articles'];
      break;
    case 'kinesthetic':
      resources = ['hands-on projects', 'tutorials'];
      break;
  }

  // Create a basic plan based on current skill level
  switch (current_skill_level) {
    case 'beginner':
      plan.push(`Start with the basics of ${topic} using ${resources[0]} and ${resources[1]}.`);
      plan.push('Take notes and summarize key points.');
      break;
    case 'intermediate':
      plan.push(`Deepen your understanding of ${topic} through more advanced ${resources[0]} and ${resources[1]}.`);
      plan.push('Practice what you learn with small projects or exercises.');
      break;
    case 'advanced':
      plan.push(`Explore complex topics in ${topic} using expert-level ${resources[0]} and ${resources[1]}.`);
      plan.push('Contribute to the field by creating original content or solving real-world problems.');
      break;
  }

  // Adjust the plan based on available time
  if (time_available_hours < 5) {
    plan.push(`Focus on high-impact resources like summaries and cheat sheets.`);
  } else if (time_available_hours >= 10 && time_available_hours < 20) {
    plan.push(`Balance learning with practice by dedicating some time to both.`);
  } else {
    plan.push(`Explore a wide range of ${resources.join(' and ')} to gain comprehensive knowledge.`);
  }

  // Save the plan to local storage for future reference
  await localRustToolkitShinkaiSqliteQueryExecutor(`CREATE TABLE IF NOT EXISTS learning_plans (topic TEXT, plan TEXT)`);
  await localRustToolkitShinkaiSqliteQueryExecutor(`INSERT INTO learning_plans (topic, plan) VALUES (?, ?)`, [topic, JSON.stringify(plan)]);

  return { plan };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"topic":"machine learning","current_skill_level":"beginner","time_available_hours":10,"learning_style":"visual"}')
  
  try {
    const program_result = await run({}, {"topic":"machine learning","current_skill_level":"beginner","time_available_hours":10,"learning_style":"visual"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

