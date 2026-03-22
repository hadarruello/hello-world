"use client";

import { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 mt-0.5 cursor-pointer accent-blue-600"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`font-medium ${
            task.completed
              ? "line-through text-gray-400"
              : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-sm mt-1 ${
              task.completed ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="flex gap-2 mt-2 flex-wrap">
          {task.category && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {task.category}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-600 transition-colors text-lg"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
