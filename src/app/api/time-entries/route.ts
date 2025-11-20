import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// -------- Validation Schemas ---------
const startSchema = z.object({
  taskId: z.number().positive(),
});

const stopSchema = z.object({
  id: z.number().positive(),
});

// -------- GET Running Timer --------
// GET /api/time-entries?taskId=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = Number(searchParams.get("taskId"));

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Task ID required" }, { status: 400 });
    }

    const entry = await prisma.timeEntry.findFirst({
      where: { taskId, endTime: null },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ success: true, data: entry || null });

  } catch (err) {
    console.error("Timer GET Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


// -------- START TIMER  --------
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = startSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { taskId } = parsed.data;
    const userId = Number(session?.user?.id);

    const existing = await prisma.timeEntry.findFirst({
      where: { taskId, userId, endTime: null },
    });

    if (existing) return NextResponse.json({ success: true, data: existing });

    const entry = await prisma.timeEntry.create({
      data: {
        taskId,
        userId,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });

  } catch (err) {
    console.error("Timer POST Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}



// -------- STOP TIMER (PATCH) --------
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = stopSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid ID", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const entry = await prisma.timeEntry.update({
      where: { id },
      data: { endTime: new Date() },
    });

    return NextResponse.json({ success: true, data: entry });

  } catch (err) {
    console.error("Timer PATCH Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
