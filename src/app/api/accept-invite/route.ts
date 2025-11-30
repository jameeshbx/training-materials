

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import crypto from "crypto";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//     try {
//         const { token } = await req.json();
//         if (!token) {
//             return NextResponse.json({ error: "Token is required" }, { status: 400 });
//         }

//         // 1. Get invite
//         const invite = await prisma.invite.findUnique({ where: { token } });

//         if (!invite) return NextResponse.json({ error: "Invalid invite token" }, { status: 400 });
//         if (invite.status === "ACCEPTED")
//             return NextResponse.json({ error: "Invite already used" }, { status: 400 });
//         if (invite.expiresAt < new Date())
//             return NextResponse.json({ error: "Invite expired" }, { status: 400 });

//         // 2. Generate password
//         const randomPassword = crypto.randomBytes(8).toString("hex");
//         const hashedPassword = await bcrypt.hash(randomPassword, 10);

//         // 3. Check if user already exists
//         let user = await prisma.user.findUnique({
//             where: { email: invite.email },
//         });

//         if (!user) {
//             // CREATE USER
//             user = await prisma.user.create({
//                 data: {
//                     email: invite.email,
//                     password: hashedPassword,
//                     name: invite.email.split("@")[0],
//                 },
//             });
//         } else {
//             // UPDATE PASSWORD
//             user = await prisma.user.update({
//                 where: { email: invite.email },
//                 data: { password: hashedPassword },
//             });
//         }

//         // 4. Mark invite used
//         await prisma.invite.update({
//             where: { token },
//             data: { status: "ACCEPTED" },
//         });

//         // 5. AUTO LOGIN using NextAuth
//         const loginRes = await fetch(
//             `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/credentials`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded"
//                 },
//                 body: new URLSearchParams({
//                     email: user.email,
//                     password: randomPassword,
//                 }),
//             }
//         );

//         if (loginRes.status !== 200 && loginRes.status !== 302) {
//             console.log("❌ AUTO LOGIN FAILED:", loginRes.status);
//             return NextResponse.json({ error: "Auto login failed" }, { status: 500 });
//         }

//         return NextResponse.json({ success: true });

//     } catch (error) {
//         console.error("Accept invite error:", error);
//         return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
// }


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
