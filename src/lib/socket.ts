// lib/socket.ts
import { db } from "@/lib/db";

export const emitActivity = async (data: {
  type: "taskCreated" | "timeLogged" | "login" | "logout" | "documentUploaded";
  userId: string;
  userName: string;
  teamId?: string | null;
  taskId?: string;
  taskTitle?: string;
  documentName?: string;
  hours?: number;
}) => {

  const activity = {
    ...data,
    timestamp: new Date(),   // store real Date object (not string)
  };

  try {
    // 🟢 Save activity event to database
    await db.activity.create({
      data: activity,
    });

    // 🟢 Emit realtime event if socket is available
    const io = (global as any).io;

    if (io) {
      console.log("📡 Emitting real-time activity…");
      io.emit("activity", activity);
    } else {
      console.warn("⚠️ io not available — skipping realtime emit");
    }

  } catch (error) {
    console.error("❌ Failed to emit activity:", error);
  }
};
