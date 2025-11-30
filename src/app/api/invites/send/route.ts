import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendInviteEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
console.log(email,"emaillllllllllllllllllllllllllllllll");

    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const token = randomBytes(32).toString("hex");
console.log(token,"emaillllllllllllllllllllllllllllllll");
    await prisma.invite.create({
      data: { email, token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    await sendInviteEmail(email, token);

    return NextResponse.json({ message: "Invitation sent successfully 🎉" });
  } catch (error: any) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}