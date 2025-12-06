

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ✅ STEP 2.1: Import cache
import { cache } from "@/lib/cache";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // --------------------------------------------
        // ✅ STEP 2.2: Define cache key & check cache
        // --------------------------------------------
        const CACHE_KEY = "reports:data";

        const cached = await cache.get(CACHE_KEY);
        if (cached) {
            console.log("📌 Reports API → Cache HIT");
            return NextResponse.json(cached);
        }
        console.log("📌 Reports API → Cache MISS, calculating...");

        // --------------------------------------------
        // Your existing report calculation logic
        // --------------------------------------------

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

        const weeklyMap: Record<
            string,
            { userName: string; totalHours: number }
        > = {};

        weekly.forEach((entry) => {
            const durationMinutes = entry.duration ?? 0;
            const hours = durationMinutes / 60;

            if (!weeklyMap[entry.userId]) {
                weeklyMap[entry.userId] = {
                    userName:
                        entry.user?.name || entry.user?.email || "Unknown User",
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

        const result = {
            weeklyHoursPerMember,
            taskDistribution,
        };

        // --------------------------------------------
        // ✅ STEP 2.3: Save result to cache
        // --------------------------------------------
        await cache.set(CACHE_KEY, result, 60 * 5); // cache for 5 minutes

        // --------------------------------------------
        // Return the result
        // --------------------------------------------
        return NextResponse.json(result);

    } catch (error) {
        console.error("Error generating reports:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
