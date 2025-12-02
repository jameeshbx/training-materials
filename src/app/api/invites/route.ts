import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendInviteEmail } from "@/lib/email";
import { logAction } from "@/lib/audit";   // <---- ADD THIS LINE

export async function POST(req: NextRequest) {
  try {
    console.log("📨 /api/invite called");

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, teamId } = body as { email: string; teamId: string };

    if (!email || !teamId) {
      return NextResponse.json(
        { error: "Email and teamId are required" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await db.invite.create({
      data: {
        email,
        token,
        teamId,
        invitedBy: user.id,
      },
    });

    // ⭐ AUDIT LOG ENTRY ⭐
    await logAction({
      action: "INVITE_SENT",
      userId: user.id,
      userName: user.name, 
      targetType: "INVITE",
      targetId: invite.id,
      meta: { email },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const inviteLink = `${baseUrl}/invite/accept?token=${invite.token}`;

    const team = await db.team.findUnique({ where: { id: teamId } });

    await sendInviteEmail({
      to: email,
      inviteLink,
      teamName: team?.name || "our team",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error creating invite:", err);
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
