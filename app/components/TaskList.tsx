"use client";

import { useState, useEffect } from "react";
import { Task, TaskFilter } from "@/lib/types";
import { getTasks, toggleTask, deleteTask } from "@/lib/storage";
import TaskItem from "./TaskItem";

interface TaskListProps {
  userId: string;
}

export default function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [operatingTaskId, setOperatingTaskId] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [userId]);

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTasks(userId);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      setOperatingTaskId(id);
      await toggleTask(id, userId);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Failed to toggle task");
    } finally {
      setOperatingTaskId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setOperatingTaskId(id);
      await deleteTask(id, userId);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    } finally {
      setOperatingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (isLoading) {
    return <p className="text-zinc-400 text-center py-8">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "completed"] as TaskFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">
            {filter === "all" && "No tasks yet. Create one to get started!"}
            {filter === "pending" && "All caught up! No pending tasks."}
            {filter === "completed" && "No completed tasks yet."}
          </p>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              isOperating={operatingTaskId === task.id}
            />
          ))
        )
      </div>

      {/* Summary */}
      <div className="text-sm text-zinc-400 pt-4">
        {tasks.length} total • {tasks.filter((t) => !t.completed).length}{" "}
        pending • {tasks.filter((t) => t.completed).length} completed
      </div>
    </div>
  );
}
