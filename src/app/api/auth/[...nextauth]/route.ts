export const dynamic = "force-dynamic";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import xss from "xss";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        // 1️⃣ Basic null check
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        // 2️⃣ Sanitize values with XSS cleanup
        const rawData = {
          email: xss(credentials.email).trim().toLowerCase(),
          password: String(credentials.password),
        };

        // 3️⃣ Zod validation
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(5),
        });

        let data;
        try {
          data = schema.parse(rawData);
        } catch (error) {
          // Do NOT expose exact validation error
          throw new Error("Invalid email or password");
        }

        // 4️⃣ Fetch user from DB
        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });

        // Avoid user enumeration
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // 5️⃣ Password compare
        const valid = await bcrypt.compare(data.password, user.password);

        if (!valid) {
          throw new Error("Invalid email or password");
        }

        // 6️⃣ Return user data to attach to JWT
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
