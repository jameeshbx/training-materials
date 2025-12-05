
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//     try {
//         const { name, email, password, role } = await req.json();

//         if (!name || !email || !password || !role) {
//             return NextResponse.json(
//                 { message: "All fields are required" },
//                 { status: 400 }
//             );
//         }

//         const existingUser = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (existingUser) {
//             return NextResponse.json(
//                 { message: "Email already registered" },
//                 { status: 400 }
//             );
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 password: hashedPassword,
//                 role,
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//             },
//         });

//         return NextResponse.json(
//             { message: "User created successfully", user: newUser },
//             { status: 201 }
//         );

//     } catch (error) {
//         console.error("Signup Error:", error);
//         return NextResponse.json(
//             { message: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import { sanitizeAuthInput } from "@/lib/sanitize";
// import { checkRateLimit } from "@/lib/rateLimit";

// export const runtime = "nodejs"; // Optional but recommended for App Router APIs

// function getClientIp(req: Request) {
//     const forwarded = req.headers.get("x-forwarded-for");
//     if (forwarded) return forwarded.split(",")[0].trim();

//     const realIp = req.headers.get("x-real-ip");
//     if (realIp) return realIp;

//     return "unknown";
// }

// export async function POST(req: Request) {
//     try {
//         // 1️⃣ Rate limit per IP (5 requests/min)
//         const ip = getClientIp(req);
//         const rateKey = `signup:${ip}`;

//         const rl = checkRateLimit(rateKey, { windowMs: 60_000, maxRequests: 5 });
//         if (!rl.ok) {
//             const retryAfter = Math.ceil((rl.retryAfterMs || 0) / 1000);
//             return new NextResponse(
//                 JSON.stringify({ message: "Too many signup attempts. Please try again later." }),
//                 {
//                     status: 429,
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Retry-After": retryAfter.toString(),
//                     },
//                 }
//             );
//         }

//         // 2️⃣ Read body safely
//         const rawBody = await req.json().catch(() => ({}));

//         // 3️⃣ Sanitize inputs
//         const sanitized = sanitizeAuthInput(rawBody);
//         const { email, password, username } = sanitized;
//         const name = rawBody.name?.trim(); // You can sanitize more if needed
//         const role = rawBody.role?.trim();

//         if (!name || !email || !password || !role) {
//             return NextResponse.json(
//                 { message: "All fields are required" },
//                 { status: 400 }
//             );
//         }

//         // 4️⃣ Check if user already exists
//         const existingUser = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (existingUser) {
//             return NextResponse.json(
//                 { message: "Email already registered" },
//                 { status: 400 }
//             );
//         }

//         // 5️⃣ Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // 6️⃣ Create user
//         const newUser = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 password: hashedPassword,
//                 role,
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//             },
//         });

//         return NextResponse.json(
//             { message: "User created successfully", user: newUser },
//             { status: 201 }
//         );

//     } catch (error) {
//         console.error("Signup Error:", error);
//         return NextResponse.json(
//             { message: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sanitizeAuthInput } from "@/lib/sanitize";
// ⭐ Use this directly
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

function getClientIp(req: Request) {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();

    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp;

    return "unknown";
}

export async function POST(req: Request) {
    try {
        // 1️⃣ Rate limit
        const ip = getClientIp(req);
        const rl = checkRateLimit(`signup:${ip}`, {
            windowMs: 60_000,
            maxRequests: 5,
        });

        if (!rl.ok) {
            return new NextResponse(
                JSON.stringify({ message: "Too many signup attempts. Please try again later." }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": Math.ceil((rl.retryAfterMs || 0) / 1000).toString(),
                    },
                }
            );
        }

        // 2️⃣ Get and sanitize the request body
        const raw = await req.json().catch(() => ({}));
        const sanitized = sanitizeAuthInput(raw);
        const { name, email, password, role } = sanitized;

        // 4️⃣ Validate
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // 5️⃣ Check existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 400 }
            );
        }

        // 6️⃣ Hash password (safe)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7️⃣ Create user (sanitized)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(
            { message: "User created successfully", user: newUser },
            { status: 201 }
        );

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
