import Anthropic from "@anthropic-ai/sdk";
import { Task } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ParsedTask extends Omit<Task, "id" | "createdAt"> {
  category?: string;
}

export async function generateTasksFromParagraph(
  paragraph: string
): Promise<ParsedTask[]> {
  const response = await client.messages.create({
    model: "claude-opus-4-1",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Extract tasks from this text. Return ONLY a JSON array with NO other text. Each task must have: title (string), description (optional), category (optional - one of: cleaning, lawn, maintenance, home repair, other), dueDate (optional ISO string), completed (false).

Text: ${paragraph}

Example: [{"title":"Clean kitchen","description":"Deep clean","category":"cleaning","dueDate":null,"completed":false}]`,
      },
    ],
  });

  // Extract text from response
  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response format from Claude");
  }

  let tasks: ParsedTask[] = [];
  
  try {
    // Try direct JSON parse first
    tasks = JSON.parse(content.text);
  } catch (e) {
    // Try finding JSON in the text
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        tasks = JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.error("Failed to parse found JSON:", e2);
      }
    }
  }

  console.log("Parsed tasks:", tasks);
    // Validate and transform tasks
  return tasks
    .filter((task: any) => task && task.title)
    .map((task: any) => ({
      title: String(task.title).trim().slice(0, 100),
      description: task.description ? String(task.description).trim().slice(0, 500) : undefined,
      category: task.category || undefined,
      dueDate: task.dueDate || undefined,
      completed: false,
    }));
}
