"use client";

import { useState, useEffect } from "react";
import { Task, TaskFilter } from "@/lib/types";
import { getTasks, toggleTask, deleteTask } from "@/lib/storage";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTasks(getTasks());
    setIsLoading(false);
  }, []);

  const handleToggle = (id: string) => {
    toggleTask(id);
    setTasks(getTasks());
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    setTasks(getTasks());
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (isLoading) {
    return <p className="text-gray-500">Loading tasks...</p>;
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
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
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
            />
          ))
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600 pt-4">
        {tasks.length} total • {tasks.filter((t) => !t.completed).length}{" "}
        pending • {tasks.filter((t) => t.completed).length} completed
      </div>
    </div>
  );
}
