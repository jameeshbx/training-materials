
// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import { emitActivity } from "@/lib/emitActivity";
// import { checkRateLimit } from "@/lib/rateLimit";   // ⭐ ADD THIS IMPORT

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials, req) {
//                 // ⭐ EXTRACT IP ADDRESS
//                 const ip =
//                     req.headers["x-forwarded-for"]?.split(",")[0] ||
//                     req.headers["x-real-ip"] ||
//                     "unknown";

//                 // ⭐ RATE LIMIT : max 5 attempts per minute
//                 const rl = checkRateLimit(`login:${ip}`, {
//                     windowMs: 60_000,
//                     maxRequests: 5,
//                 });

//                 if (!rl.ok) {
//                     console.log("🚫 RATE LIMIT TRIGGERED for IP:", ip);

//                     // ⭐ Throw special error → frontend can detect
//                     return { error: "RATE_LIMIT" } as any;
//                 }

//                 // ⭐ EXISTING LOGIN LOGIC (unchanged)
//                 if (!credentials?.email || !credentials?.password) return null;

//                 const user = await prisma.user.findUnique({
//                     where: { email: credentials.email },
//                 });

//                 if (!user || !user.password) return null;

//                 const isValid = await bcrypt.compare(
//                     credentials.password,
//                     user.password
//                 );

//                 if (!isValid) return null;

//                 return {
//                     id: user.id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                 };
//             },
//         }),
//     ],

//     session: {
//         strategy: "jwt",
//     },

//     pages: {
//         signIn: "/",
//     },

//     secret: process.env.NEXTAUTH_SECRET,

//     callbacks: {
//         async signIn({ user }) {
//             try {
//                 const saved = await prisma.activity.create({
//                     data: {
//                         teamId: "default-team",
//                         message: `${user.name} logged in`,
//                         userName: user.name ?? "Unknown",
//                     },
//                 });

//                 await emitActivity("default-team", {
//                     message: saved.message,
//                     userName: saved.userName,
//                     createdAt: saved.createdAt.toISOString(),
//                 });

//             } catch (err) {
//                 console.error("⚠ Error generating login activity:", err);
//             }

//             return true;
//         },

//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.role = user.role;
//             }

//             if (!token.role) token.role = "user";

//             console.log("🔥 TOKEN IN JWT CALLBACK:", token);
//             return token;
//         },

//         async session({ session, token }) {
//             if (session.user) {
//                 (session.user as any).id = token.id;
//                 (session.user as any).role = token.role;
//             }
//             return session;
//         },
//     },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { emitActivity } from "@/lib/emitActivity";
import { checkRateLimit } from "@/lib/rateLimit"; // KEEP existing import

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // ⭐ EXTRACT IP ADDRESS (works in both dev & prod proxies)
                const ip =
                    req.headers["x-forwarded-for"]?.split(",")[0] ||
                    req.headers["x-real-ip"] ||
                    "unknown";

                // ⭐ RATE LIMIT INSIDE authorize() (max 5 attempts / 60s)
                const rl = checkRateLimit(`login:${ip}`, {
                    windowMs: 60_000,
                    maxRequests: 5,
                });

                if (!rl.ok) {
                    // Terminal log so you see the event server-side
                    console.log("🚫 RATE LIMIT TRIGGERED for IP:", ip, "retryAfterMs:", rl.retryAfterMs);

                    // IMPORTANT: throw an object that NextAuth will forward to signIn()
                    throw { message: "RATE_LIMIT" };
                }

                // ⭐ EXISTING LOGIN LOGIC (unchanged)
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/",
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user }) {
            try {
                const saved = await prisma.activity.create({
                    data: {
                        teamId: "default-team",
                        message: `${user.name} logged in`,
                        userName: user.name ?? "Unknown",
                    },
                });

                await emitActivity("default-team", {
                    message: saved.message,
                    userName: saved.userName,
                    createdAt: saved.createdAt.toISOString(),
                });

            } catch (err) {
                console.error("⚠ Error generating login activity:", err);
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            if (!token.role) token.role = "user";

            console.log("🔥 TOKEN IN JWT CALLBACK:", token);
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
