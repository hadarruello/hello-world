"use client";

import { useState } from "react";
import { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isOperating: boolean;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  isOperating,
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    if (
      window.confirm(
        `Delete "${task.title}"? This action cannot be undone.`
      )
    ) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };
  return (
    <div className="flex items-start gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        disabled={isOperating}
        className="w-5 h-5 mt-0.5 cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`font-medium ${
            task.completed
              ? "line-through text-zinc-500"
              : "text-zinc-50"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-sm mt-1 ${
              task.completed ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="flex gap-2 mt-2 flex-wrap">
          {task.category && (
            <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">
              {task.category}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        disabled={isOperating || isDeleting}
        className="text-zinc-500 hover:text-red-500 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete task"
      >
        {isDeleting ? "…" : "✕"}
      </button>
    </div>
  );
}
