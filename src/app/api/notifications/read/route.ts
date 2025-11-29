import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { userId: Number(session.user.id), seen: false },
    data: { seen: true }
  });

  return NextResponse.json({ message: "Marked all as read" });
}
