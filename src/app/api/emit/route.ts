import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, activity, teamId } = body;

    // activity contains: type, userId, userName, taskId, taskTitle, documentName, timestamp
    console.log("📥 Activity received:", activity);

    // Save to DB ONLY if activity type is provided
    if (activity?.type) {
      console.log("🗄 Saving activity to DB...");
      await db.activity.create({
        data: {
          type: activity.type,
          userId: activity.userId,
          userName: activity.userName,
          teamId: activity.teamId,
          taskId: activity.taskId,
          taskTitle: activity.taskTitle,
          documentName: activity.documentName,
          hours: activity.hours,
          timestamp: new Date(activity.timestamp),
        },
      });
      console.log("✅ Activity saved to DB");
    }

    // SOCKET.IO REALTIME EMIT
    const io = (global as any).io;

    if (io) {
      console.log("📢 Emitting realtime socket event");
      io.emit("activity", activity);

      if (teamId) {
        io.to(`team:${teamId}`).emit("activity", activity);
      }
    } else {
      console.warn("⚠ io not ready, skip realtime emit");
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Error in /api/emit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
