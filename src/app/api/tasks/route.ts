export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { emitEvent } from "@/lib/socketServer.ts"; 
import { createAuditLog } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request-meta";
import { logger } from "@/lib/logger";
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "progress", "completed"]).default("pending"),
  dueDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
   
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let filters: any = {};

    if (search) {
      filters.AND = [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    if (date && date !== "all") {
      filters.dueDate = {
        gte: new Date(date + "T00:00:00.000Z"),
        lt: new Date(date + "T23:59:59.999Z"),
      };
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, id: true } },
      },
    });

    const total = await prisma.task.count({ where: filters });

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    // logger.error("Something failed");

    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { name: true } },
      },
    });

    const { ip, userAgent } = getRequestMeta(req);

   await createAuditLog({
  userId,
  action: "TASK_CREATED",
  entity: "Task",
  entityId: task.id,
  details: {
    title: task.title,   // ⭐ now UI always gets proper name
    status: task.status,
    dueDate: task.dueDate,
  },
  ip,
  userAgent,
});


    emitEvent("taskCreated", task);

    return NextResponse.json({ success: true, data: task }, { status: 201 });

  } catch (err) {
    console.error("Tasks POST Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

