import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
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
      token.id = (user as any).id;
      token.role = (user as any).role;
    }
    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
    return session;
  }
}


};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
