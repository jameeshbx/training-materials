import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        console.log("SESSION DATA:", session);
        if (!session) {
            return NextResponse.json({ error: "No session" }, { status: 401 });
        }

        if (session.user.role.toLowerCase() !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }


        const users = await prisma.user.findMany({
            include: {
                tasks: true,
            },
        });

        console.log("✔ USERS FETCHED:", users.length);

        return NextResponse.json(users);
    } catch (error: any) {
        console.error("❌ ADMIN API ERROR:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
