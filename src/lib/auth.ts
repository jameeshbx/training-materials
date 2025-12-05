// lib/auth.ts

import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { emitActivity } from "@/lib/socket";
import { sanitizeValue } from "@/lib/sanitize";


export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "default-secret-key-change-in-production",

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

     async authorize(credentials) {
  try {
    console.log("Authorize called with:", {
      email: credentials?.email,
      password: credentials?.password ? "***" : undefined,
    });

    // 🧼 SANITIZE USER INPUT
    const cleanData = sanitizeValue(credentials);
    const email = cleanData.email.trim();
    const password = cleanData.password.trim();

    if (!email || !password) {
      console.log("Missing credentials");
      return null;
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found in database");
      return null;
    }

    if (!user.password) {
      console.log("User has no password set");
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("Invalid password");
      return null;
    }

    console.log("Authentication successful (database user)");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teamId: user.teamId,
    } as any;

  } catch (error) {
    console.error("❌ Error in authorize:", error);
    return null;
  }
},
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.teamId = (user as any).teamId;
        
        // 🔥 EMIT LOGIN ACTIVITY (only once when user first logs in)
        // The `user` parameter is only present on initial login, not on subsequent requests
        // Check if we haven't already emitted to prevent duplicates
        if (!token.loginActivityEmitted) {
          await emitActivity({
            type: "login",
            userId: user.id,
            userName: (user as any).name,
            teamId: (user as any).teamId,
          });
          token.loginActivityEmitted = true;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).teamId = token.teamId;
      }
      return session;
    },
  },
};
