import { Task } from "./types";
import { supabase } from "./supabase";

export async function addTaskServer(
  userId: string,
  task: Omit<Task, "id" | "createdAt">
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      category: task.category,
      due_date: task.dueDate,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding task:", error);
    throw error;
  }

  return {
    id: data.id.toString(),
    title: data.title,
    description: data.description,
    completed: data.completed,
    dueDate: data.due_date,
    category: data.category,
    createdAt: data.created_at,
  };
}
