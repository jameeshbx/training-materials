import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    // Only admin can view audit logs
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100, // latest 100 logs
        include: {
            user: true, // to show who performed it
        }
    });

    return NextResponse.json({ logs });
}
