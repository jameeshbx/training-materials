import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const invite = await db.invite.findUnique({ where: { token } });

    if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });

    const nameFromEmail = invite.email.split("@")[0];
    const existingUser = await db.user.findUnique({ where: { email: invite.email } });

    let user;

    if (!existingUser) {
      user = await db.user.create({
        data: {
          email: invite.email,
          name: nameFromEmail,
          password: await bcrypt.hash("123456", 10),
          role: "USER",
          teamId: invite.teamId,
        },
      });
    } else {
      user = existingUser;
    }

    await db.invite.update({
      where: { token },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      email: invite.email,
      password: "123456",
    });
  } catch (error) {
    console.error("Invite accept error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
