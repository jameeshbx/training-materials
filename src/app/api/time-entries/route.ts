import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
import { auth } from "@/auth"; // ✔ FIXED — use auth instead of authOptions
import { z } from "zod";

// --------- Zod Schema ----------

const timeEntrySchema = z.object({
  taskId: z.number().int().positive(),
  startTime: z.number().or(z.string()), // Date.now() (number) or ISO string
  endTime: z.number().or(z.string()),   // same here
  // duration optional aanel:
  duration: z.number().int().nonnegative().optional(),
});

// --------- POST /api/time-entries ----------

export async function POST(req: Request) {
  try {
    // 1) Auth check
    const session = await await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(session.user.id); // make sure id is number

    // 2) Body parse + validate
    const json = await req.json();
    const parsed = timeEntrySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { taskId, startTime, endTime, duration } = parsed.data;

    // 3) Convert start/end to Date
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { message: "Invalid date values" },
        { status: 400 }
      );
    }

    // 4) Create time entry in DB
    const timeEntry = await prisma.timeEntry.create({
      data: {
        taskId,
        userId,
        startTime: start,
        endTime: end,
        // duration DB-il field illa enkil idu ignore cheyyam
        // later add field vannal use cheyyam
      },
    });

    return NextResponse.json(
      {
        message: "Time entry saved successfully",
        timeEntry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating time entry:", error);
    return NextResponse.json(
      {
        message: "Server error",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// --------- (Optional) GET /api/time-entries ----------

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    let entries;

    if (taskId) {
      // Filter by task
      entries = await prisma.timeEntry.findMany({
        where: { taskId: Number(taskId) },
        include: {
          task: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // return all
      entries = await prisma.timeEntry.findMany({
        include: {
          task: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(entries, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching time entries", error: error.message },
      { status: 500 }
    );
  }
}
