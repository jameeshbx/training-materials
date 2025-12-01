import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const logs = await db.auditLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform logs to include userName from user relation or stored userName
  const logsWithUserName = logs.map((log) => ({
    ...log,
    userName: log.user?.name || log.userName || "Unknown",
    userEmail: log.user?.email || null,
  }));

  return NextResponse.json({ logs: logsWithUserName });
}
