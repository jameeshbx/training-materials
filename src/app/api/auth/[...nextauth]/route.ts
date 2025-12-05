import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";
import { tooManyRequests } from "@/lib/rateLimiter";

// Type declarations for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// ----------------------------
// AUTH OPTIONS
// ----------------------------
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        // --------------------------------------
        // 🔹 RATE LIMITER (IP-based)
        // --------------------------------------
        const ip =
          (req.headers?.["x-forwarded-for"] as string) ||
          "unknown-ip";

        if (tooManyRequests(ip)) {
          console.warn("⛔ Too many login attempts from:", ip);
          return null; // silently reject
        }

        // --------------------------------------
        // 🔹 SANITIZATION
        // --------------------------------------
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password?.trim();

        // --------------------------------------
        // 🔹 VALIDATION
        // --------------------------------------
        if (!email || !password) {
          console.error("❌ Validation Error: Missing email or password");
          return null;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          console.error("❌ Validation Error: Invalid email format");
          return null;
        }

        if (password.length < 6) {
          console.error("❌ Validation Error: Password must be ≥ 6 chars");
          return null;
        }

        // --------------------------------------
        // 🔹 EXISTING LOGIN LOGIC (unchanged)
        // --------------------------------------
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // ACTIVITY LOG
        try {
          const activity = await prisma.activity.create({
            data: {
              userId: user.id,
              userName: user.name,
              action: "logged in",
            },
          });

          if (global.io) global.io.emit("activityCreated", activity);
        } catch (error) {
          console.error("Activity log failed:", error);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // -----------------------------
  // CALLBACKS
  // -----------------------------
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },

  session: { strategy: "jwt" },

  pages: {
    signIn: "/api/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };
