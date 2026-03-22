"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import TaskList from "./components/TaskList";
import { useAuth, signOut } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Household Tasks
            </h1>
            <p className="text-gray-600 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/tasks/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              + New Task
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>

        {/* Task List */}
        <TaskList userId={user.id} />
      </div>
    </div>
  );
}
