"use client";

import { useState } from "react";

interface AITaskGeneratorProps {
  userId: string;
  onTasksGenerated?: () => void;
}

export default function AITaskGenerator({
  userId,
  onTasksGenerated,
}: AITaskGeneratorProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerateTasks = async () => {
    if (!input.trim()) {
      setError("Please enter a description or list of tasks");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraph: input, userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate tasks");
      }

      const data = await response.json();
      setSuccess(`Generated ${data.count} task(s)!`);
      setInput("");

      // Callback to refresh task list in parent component
      onTasksGenerated?.();

      // Auto-clear success after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
      <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
        ✨ AI Task Generator
      </h2>
      <p className="text-zinc-400 text-sm mb-4">
        Describe your tasks in natural language and AI will generate them for you.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="E.g., 'Clean the kitchen, mow the lawn on Saturday, fix the bathroom sink'"
        disabled={loading}
        className="w-full p-3 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-blue-500 focus:outline-none resize-none text-sm disabled:opacity-50 mb-3"
        rows={3}
        maxLength={1000}
      />

      <div className="flex justify-between items-center gap-3">
        <button
          onClick={handleGenerateTasks}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Tasks"}
        </button>
        <p className="text-zinc-500 text-xs">{input.length}/1000 characters</p>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-900/30 text-red-300 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-900/30 text-green-300 rounded text-sm">
          {success}
        </div>
      )}
    </div>
  );
}
