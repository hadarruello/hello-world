import { NextRequest, NextResponse } from "next/server";
import { generateTasksFromParagraph } from "@/lib/ai";
import { addTaskServer } from "@/lib/storage-server";

export async function POST(request: NextRequest) {
  try {
    const { paragraph, userId } = await request.json();

    console.log("Generate tasks request:", { paragraphLength: paragraph?.length, userId });

    if (!paragraph || !userId) {
      return NextResponse.json(
        { error: "Missing paragraph or userId" },
        { status: 400 }
      );
    }

    if (paragraph.trim().length < 10) {
      return NextResponse.json(
        { error: "Paragraph must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Generate tasks from paragraph using Claude
    const generatedTasks = await generateTasksFromParagraph(paragraph);

    if (generatedTasks.length === 0) {
      return NextResponse.json(
        { error: "Could not generate any tasks from the provided text" },
        { status: 400 }
      );
    }

    // Insert tasks into database
    const createdTasks = [];
    for (const task of generatedTasks) {
      try {
        const created = await addTaskServer(userId, task);
        createdTasks.push(created);
      } catch (err) {
        console.error("Failed to add task:", err);
      }
    }

    return NextResponse.json({
      tasks: createdTasks,
      count: createdTasks.length,
    });
  } catch (error: any) {
    console.error("Error generating tasks:", error);

    // Check for API key issues
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate tasks" },
      { status: 500 }
    );
  }
}
