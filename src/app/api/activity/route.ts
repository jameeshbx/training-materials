import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const logs = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: logs });
}
