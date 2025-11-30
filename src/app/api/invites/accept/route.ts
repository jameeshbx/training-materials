import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const session = await getServerSession(authOptions);

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const invite = await db.invite.findUnique({ where: { token } });

    if (!invite) {
      return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
    }

    // Create username from email
    const nameFromEmail = invite.email.split("@")[0];

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: invite.email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: invite.email,
          name: nameFromEmail,
          password: await bcrypt.hash("123456", 10), // default password
          role: "USER",
        },
      });
    }

    // Add user to team
    await db.team.update({
      where: { id: invite.teamId },
      data: { users: { connect: { id: user.id } } },
    });

    // Create activity feed entry
  await db.activity.create({
  data: {
    type: "USER_JOINED",
    activityText: `${user.name} joined the team`,
    userId: user.id,
    userName: user.name,
    teamId: invite.teamId,
  },
});


    // Mark invite accepted
    await db.invite.update({
      where: { token },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}