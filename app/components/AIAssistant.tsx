"use client";

import { useState } from "react";

interface AIAssistantProps {
  userId: string;
  onTasksGenerated?: () => void;
}

export default function AIAssistant({
  userId,
  onTasksGenerated,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      const response = await fetch("/api/ai/generate-tasks", {
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

      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
        title="AI Assistant"
      >
        ✨ AI Assistant
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 bg-zinc-800 rounded-lg shadow-2xl border border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
          ✨ AI Task Generator
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-zinc-400 text-sm">
          Describe your tasks or paste a list, and AI will generate them for you.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., 'Clean the kitchen, mow the lawn on Saturday, fix the bathroom sink'"
          disabled={loading}
          className="w-full p-3 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-blue-500 focus:outline-none resize-none text-sm disabled:opacity-50"
          rows={4}
          maxLength={1000}
        />

        {error && (
          <div className="p-3 bg-red-900/30 text-red-300 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/30 text-green-300 rounded text-sm">
            {success}
          </div>
        )}

        <button
          onClick={handleGenerateTasks}
          disabled={loading || !input.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Tasks"}
        </button>

        <p className="text-zinc-500 text-xs">
          Powered by Claude AI • {input.length}/1000 characters
        </p>
      </div>
    </div>
  );
}
