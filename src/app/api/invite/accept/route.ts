import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { emitEvent } from "@/lib/socketServer.ts"; 

export async function POST(req: Request) {
  const { token } = await req.json();

  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite) return NextResponse.json({ message: "Invalid invite" }, { status: 400 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ message: "Invite expired" }, { status: 400 });

  let user = await prisma.user.findUnique({ where: { email: invite.email } });
  let tempPassword = ""; // Declare tempPassword outside the if block

  // If user doesn't exist → create account
  if (!user) {
    tempPassword = randomBytes(8).toString("hex"); // Now assign to the outer variable
    const hashed = await bcrypt.hash(tempPassword, 10);

    user = await prisma.user.create({
      data: {
        name: invite.email.split("@")[0],
        email: invite.email,
        password: hashed
      }
    });
  } else {
    // If user already exists, we still need a password for login
    // But we can't return the actual password, so we need a different approach
    return NextResponse.json({ 
      message: "User already exists. Please log in with your existing password.",
      email: invite.email,
      login: false 
    }, { status: 400 });
  }

  // Mark invite as accepted
  await prisma.invite.update({
    where: { token },
    data: { status: "ACCEPTED" }
  });
   emitEvent("invite_accepted", { 
    email: user.email,
    userId: user.id,
    name: user.name,
    timestamp: new Date().toISOString()
  });

  return NextResponse.json({
    message: "Invite accepted 🎉 User created",
    email: invite.email,
    password: tempPassword, // Now this is accessible
    login: true
  });
}