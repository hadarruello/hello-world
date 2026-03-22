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
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a task management assistant. Extract tasks from the following paragraph and return a JSON array of tasks. Each task should have: title (string), description (optional string), category (optional string - one of: cleaning, lawn, maintenance, home repair, other), and dueDate (optional ISO date string). Return ONLY valid JSON array, no other text.

Paragraph:
${paragraph}

Return JSON array like: [{"title":"...","description":"...","category":"...","dueDate":"2024-03-25","completed":false}]`,
      },
    ],
  });

  // Extract text from response
  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response format from Claude");
  }

  // Parse JSON response
  const jsonMatch = content.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse tasks from AI response");
  }

  const tasks = JSON.parse(jsonMatch[0]) as ParsedTask[];

  // Validate and transform tasks
  return tasks.map((task) => ({
    title: String(task.title || "").trim().slice(0, 100),
    description: task.description ? String(task.description).trim().slice(0, 500) : undefined,
    category: task.category || undefined,
    dueDate: task.dueDate || undefined,
    completed: false,
  }));
}
