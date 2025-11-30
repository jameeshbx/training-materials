


import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

        const invite = await prisma.invite.findUnique({ where: { token } });
        if (!invite) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        if (invite.expiresAt < new Date()) return NextResponse.json({ error: "Expired" }, { status: 400 });

        const randomPassword = crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // find or create user
        let user = await prisma.user.findUnique({ where: { email: invite.email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: invite.email,
                    password: hashedPassword,
                    name: invite.email.split("@")[0],
                },
            });
        } else {
            await prisma.user.update({
                where: { email: invite.email },
                data: { password: hashedPassword },
            });

            user.password = randomPassword;
        }

        await prisma.invite.update({
            where: { token },
            data: { status: "ACCEPTED" },
        });

        return NextResponse.json({
            success: true,
            email: user.email,
            password: randomPassword,
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
