export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
  createdAt: string;
}

export type TaskFilter = "all" | "pending" | "completed";
