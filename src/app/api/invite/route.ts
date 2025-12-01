
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Create token
        const token = crypto.randomBytes(32).toString("hex");

        // Save invitation in DB
        await prisma.invite.create({
            data: {
                email,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Create invitation link
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

        // -----------------------------
        // SEND EMAIL USING RESEND
        // -----------------------------
        await resend.emails.send({
            from: "Acme App <onboarding@resend.dev>",
            to: email,
            subject: "You're invited!",
            html: `
        <h2>Welcome!</h2>
        <p>You have been invited to join the app.</p>
        <p>Click below to accept the invitation:</p>
        <a href="${inviteLink}" 
           style="padding: 10px 20px; background: #2563eb; color: white; text-decoration:none; border-radius: 5px;">
           Accept Invitation
        </a>
        <p>If the button doesn't work, copy this link:</p>
        <p>${inviteLink}</p>
      `,
        });

        return NextResponse.json({
            message: "Invitation email sent",
            link: inviteLink,
        });
    } catch (err) {
        console.error("INVITE ERROR:", err);
        return NextResponse.json(
            { error: "Server error sending invitation" },
            { status: 500 }
        );
    }
}
