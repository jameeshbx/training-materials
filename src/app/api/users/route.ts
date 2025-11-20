import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await db.user.findMany({ include: { tasks: true } });
  return NextResponse.json(users);
}
