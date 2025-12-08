export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import xss from "xss";
import { z } from "zod";
import { limit } from "@/lib/rateLimiter";
import { emitEvent } from "@/lib/socketServer.ts"; 

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials, req) {
        // ---------------------------------------------------
        // 🔥 1) Rate Limit Check (Brute Force Protection)
        // ---------------------------------------------------
        const ip =
          req?.headers?.["x-forwarded-for"]?.split(",")[0] ||
          req?.headers?.["x-real-ip"] ||
          "127.0.0.1";

        // If too many attempts → block
        if (!limit(ip)) {
          throw new Error("Too many login attempts");
        }

        // ---------------------------------------------------
        // 🛡 2) Basic null check
        // ---------------------------------------------------
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        // ---------------------------------------------------
        // 🧹 3) XSS cleanup
        // ---------------------------------------------------
        const rawData = {
          email: xss(credentials.email).trim().toLowerCase(),
          password: String(credentials.password),
        };

        // ---------------------------------------------------
        // 🧭 4) Zod Validation
        // ---------------------------------------------------
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(5),
        });

        let data;
        try {
          data = schema.parse(rawData);
        } catch (error) {
          throw new Error("Invalid email or password");
        }

        // ---------------------------------------------------
        // 🔍 5) Fetch user
        // ---------------------------------------------------
        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // ---------------------------------------------------
        // 🔑 6) Compare password
        // ---------------------------------------------------
        const valid = await bcrypt.compare(data.password, user.password);

        if (!valid) {
          throw new Error("Invalid email or password");
        }
// ---------------------------------------------------
// 📢 SOCKET EMIT (Login Success)
// ---------------------------------------------------
emitEvent("userLoggedIn", {
  id: user.id,
  name: user.name,
  email: user.email,
  loggedInAt: new Date()
});
        // ---------------------------------------------------
        // 🎯 7) Return user to attach to JWT
        // ---------------------------------------------------
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
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };