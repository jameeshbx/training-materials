
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { emitActivity } from "@/lib/emitActivity";  // ⭐ ADDED

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
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
        /* ⭐ RUNS WHEN USER LOGS IN (Our New Code Here) */
        async signIn({ user }) {
            try {
                // Save login activity to database
                const saved = await prisma.activity.create({
                    data: {
                        teamId: "default-team",
                        message: `${user.name} logged in`,
                        userName: user.name ?? "Unknown",
                    },
                });

                // Emit real-time event to all dashboards
                await emitActivity("default-team", {
                    message: saved.message,
                    userName: saved.userName,
                    createdAt: saved.createdAt.toISOString(),
                });

            } catch (err) {
                console.error("⚠ Error generating login activity:", err);
                // still allow login even if activity fails
            }

            return true; // allow login
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
