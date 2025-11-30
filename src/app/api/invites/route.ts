import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendInviteEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    console.log("📨 /api/invites called"); // debug

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      console.log("❌ Unauthorized – no user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, teamId } = body as { email: string; teamId: string };

    if (!email || !teamId) {
      console.log("❌ Missing email or teamId");
      return NextResponse.json(
        { error: "Email and teamId are required" },
        { status: 400 }
      );
    }

    // generate random token
    const token = crypto.randomBytes(32).toString("hex");

    // create invite record in DB
    const invite = await db.invite.create({
      data: {
        email,
        token,
        teamId,
        invitedBy: user.id,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const inviteLink = `${baseUrl}/invite/accept?token=${invite.token}`;

    const team = await db.team.findUnique({ where: { id: teamId } });

    console.log("📧 Sending email to:", email);
    await sendInviteEmail({
      to: email,
      inviteLink,
      teamName: team?.name || "our team",
    });
    console.log("✅ Email sent via SendGrid");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error creating invite:", err);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 }
    );
  }
}
