import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        // Debug logging
        console.log("Authorize called with:", {
          email: credentials?.email,
          password: credentials?.password ? "***" : undefined,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        // Trim whitespace and compare
        const email = credentials.email.trim();
        const password = credentials.password.trim();

        if (email === "demo@demo.com" && password === "password123") {
          console.log("Authentication successful");
          return {
            id: "1",
            email: "demo@demo.com",
            name: "Demo User",
          };
        }

        console.log("Authentication failed - credentials don't match");
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

