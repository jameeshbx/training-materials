import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "progress", "completed"]).default("pending"),
});


export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Tasks GET Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
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
        ...parsed.data,
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
