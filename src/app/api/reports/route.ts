import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Calculate last 7 days window
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        // 1️⃣ WEEKLY HOURS PER TEAM MEMBER
        const weekly = await prisma.timeEntry.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                    lte: now,
                },
            },
            include: {
                user: true,
            },
        });

        // Reduce to total hours per user
        const weeklyMap: Record<
            string,
            { userName: string; totalHours: number }
        > = {};

        weekly.forEach((entry) => {
            const durationMinutes = entry.duration ?? 0; // duration is Int?
            const hours = durationMinutes / 60;

            if (!weeklyMap[entry.userId]) {
                weeklyMap[entry.userId] = {
                    userName: entry.user?.name || entry.user?.email || "Unknown User",
                    totalHours: 0,
                };
            }

            weeklyMap[entry.userId].totalHours += hours;
        });

        const weeklyHoursPerMember = Object.values(weeklyMap);

        // 2️⃣ TASK DISTRIBUTION
        const taskEntries = await prisma.timeEntry.findMany({
            include: {
                task: true,
            },
        });

        const taskMap: Record<string, { taskName: string; totalHours: number }> =
            {};

        taskEntries.forEach((entry) => {
            if (!entry.task) return;

            const durationMinutes = entry.duration ?? 0;
            const hours = durationMinutes / 60;

            if (!taskMap[entry.taskId!]) {
                taskMap[entry.taskId!] = {
                    taskName: entry.task.title,
                    totalHours: 0,
                };
            }

            taskMap[entry.taskId!].totalHours += hours;
        });

        const taskDistribution = Object.values(taskMap);

        return NextResponse.json({
            weeklyHoursPerMember,
            taskDistribution,
        });
    } catch (error) {
        console.error("Error generating reports:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
