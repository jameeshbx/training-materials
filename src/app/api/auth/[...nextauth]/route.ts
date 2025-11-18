import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password?.trim();

        // 👉 TEMP DEMO LOGIN (You can replace with DB later)
        if (email === "demo@demo.com" && password === "password123") {
          return {
            id: "1",
            name: "Demo Admin",
            email: email,
            role: "admin", // 👈 IMPORTANT
          };
        }

        // ❌ Invalid login
        return null;
      },
    }),
  ],

  callbacks: {
    // 👉 Add role to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // copy role from returned user
      }
      return token;
    },

    // 👉 Add role from token to session.user
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role; // make role available in frontend
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // redirect unauth users to /login
  },
});

export { handler as GET, handler as POST };