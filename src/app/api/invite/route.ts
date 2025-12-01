
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { logAction } from "@/lib/auditLogger";

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        console.log("📨 INVITE REQUEST RECEIVED for:", email);

        if (!email) {
            console.log("❌ No email provided");
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        console.log("🔐 Generated Token:", token);

        // Save invitation in DB
        const invite = await prisma.invite.create({
            data: {
                email,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        console.log("💾 Invite saved in DB:", invite.id);

        await logAction({
            action: "INVITE_SENT",
            entityType: "INVITE",
            entityId: invite.id,
            details: `Invitation sent to ${email}`,
        });

        // Create invite link
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;
        console.log("🔗 Invite Link:", inviteLink);

        // -----------------------------
        // SEND EMAIL USING SENDGRID
        // -----------------------------
        let emailResponse;

        try {
            const msg = {
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL!,
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
            };

            emailResponse = await sgMail.send(msg);
            console.log("📨 SENDGRID EMAIL RESPONSE:", emailResponse);

        } catch (emailErr) {
            console.error("❌ SENDGRID EMAIL ERROR:", emailErr);
        }

        return NextResponse.json({
            message: "Invitation email sent successfully",
            link: inviteLink,
        });

    } catch (err) {
        console.error("❌ INVITE API ERROR:", err);
        return NextResponse.json(
            { error: "Server error sending invitation" },
            { status: 500 }
        );
    }
}
