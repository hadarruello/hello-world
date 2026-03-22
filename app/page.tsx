import Link from "next/link";
import TaskList from "./components/TaskList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Household Tasks
          </h1>
          <Link
            href="/tasks/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + New Task
          </Link>
        </div>

        {/* Task List */}
        <TaskList />
      </div>
    </div>
  );
}
