import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { emitEvent } from "@/lib/socketServer";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error("Invalid credentials");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/login" },

  events: {
    async signIn({ user }) {
      emitEvent("user_logged_in", {
        userId: user.id,
        name: user.name,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
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
});
