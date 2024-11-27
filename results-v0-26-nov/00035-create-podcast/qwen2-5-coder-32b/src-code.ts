import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { topic: string, duration_minutes: number, style: string };
type OUTPUT = { episode_script: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { topic, duration_minutes, style } = inputs;

    // Generate a basic outline for the podcast episode
    const outline = generateOutline(topic, duration_minutes);

    // Develop the script based on the outline and style
    const episode_script = developScript(outline, style);

    return { episode_script };
}

function generateOutline(topic: string, duration_minutes: number): string[] {
    const sections = [
        `Introduction to ${topic}`,
        `Main points of discussion about ${topic}`,
        `Conclusion summarizing key takeaways from ${topic}`
    ];

    // Adjust the outline based on the duration
    if (duration_minutes > 20) {
        sections.splice(1, 0, `Detailed examples related to ${topic}`);
    }

    return sections;
}

function developScript(outline: string[], style: string): string {
    let script = "";

    outline.forEach(section => {
        switch (section) {
            case `Introduction to ${inputs.topic}`:
                script += `Welcome to today's episode where we will be diving into the topic of ${inputs.topic}. In this segment, we'll introduce what ${inputs.topic} is and why it's important.\n\n`;
                break;
            case `Main points of discussion about ${inputs.topic}`:
                script += `Now that you have a basic understanding of ${inputs.topic}, let's discuss some key points. These points will cover the most critical aspects of ${inputs.topic} and provide insights into how they impact various areas.\n\n`;
                break;
            case `Detailed examples related to ${inputs.topic}`:
                script += `To help illustrate these points, we have a few detailed examples that demonstrate the real-world implications of ${inputs.topic}. These examples will give you a clearer picture of how ${inputs.topic} works in practice.\n\n`;
                break;
            case `Conclusion summarizing key takeaways from ${inputs.topic}`:
                script += `In conclusion, the main points to remember about ${inputs.topic} are...\n\n`;
                break;
        }
    });

    // Adjust the script style
    if (style === "informal") {
        script = script.replace(/\.\.\./g, "").replace(/Now that you have a basic understanding of /g, "So, ").replace(/In conclusion,/g, "To wrap things up,");
    } else if (style === "formal") {
        script = script.replace(/\.\.\./g, " and much more.").replace(/So, /g, "Henceforth, ").replace(/To wrap things up,/g, "Conclusively,");
    }

    return script;
}