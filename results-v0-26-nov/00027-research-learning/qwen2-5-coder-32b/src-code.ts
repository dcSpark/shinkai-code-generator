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