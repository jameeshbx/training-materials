import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "progress", "completed"]).default("pending"),
    dueDate: z.string().optional(), // 👈 Add this

});


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    // Read selected date from query params
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let whereCondition: any = { userId };

    // If date provided → filter by dueDate
    if (date) {
      whereCondition.dueDate = {
        gte: new Date(date + "T00:00:00.000Z"),
        lt: new Date(date + "T23:59:59.999Z"),
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: tasks });

  } catch (err) {
    console.error("Tasks GET Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}



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
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const userId = Number(session?.user?.id || session?.user.id);

    if (!userId) {
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk", session);
      return NextResponse.json(
        { success: false, error: "User ID missing" },
        { status: 400 }
      );
    }

   const task = await prisma.task.create({
  data: {
    title: parsed.data.title,
    description: parsed.data.description,
    status: parsed.data.status,
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null, 
    user: {
      connect: { id: userId },
    },
  },
});

    return NextResponse.json({ success: true, data: task }, { status: 201 });

  } catch (err) {
    console.error("Tasks POST Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
