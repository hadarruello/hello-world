"use client";

import { Task } from "./types";
import { supabase } from "./supabase";

export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return (data || []).map((task) => ({
    id: task.id.toString(),
    title: task.title,
    description: task.description,
    completed: task.completed,
    dueDate: task.due_date,
    category: task.category,
    createdAt: task.created_at,
  })) as Task[];
}

export async function addTask(
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

export async function deleteTask(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", parseInt(id))
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export async function toggleTask(id: string, userId: string): Promise<void> {
  // Get current task
  const { data: currentTask, error: fetchError } = await supabase
    .from("tasks")
    .select("completed")
    .eq("id", parseInt(id))
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching task:", fetchError);
    throw fetchError;
  }

  // Update completion status
  const { error } = await supabase
    .from("tasks")
    .update({ completed: !currentTask.completed })
    .eq("id", parseInt(id))
    .eq("user_id", userId);

  if (error) {
    console.error("Error toggling task:", error);
    throw error;
  }
}

export async function updateTask(
  id: string,
  userId: string,
  updates: Partial<Task>
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({
      title: updates.title,
      description: updates.description,
      category: updates.category,
      due_date: updates.dueDate,
      completed: updates.completed,
    })
    .eq("id", parseInt(id))
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}
