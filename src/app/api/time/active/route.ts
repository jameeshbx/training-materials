import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // your prisma path

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  const runningEntry = await prisma.timeEntry.findFirst({
    where: {
      userId,
      endTime: null, // running timer
    },
  });

  return NextResponse.json(runningEntry);
}
