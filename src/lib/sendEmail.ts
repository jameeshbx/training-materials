import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs/umd/types";
import { AuthOptions as NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendInviteEmail(to: string, token: string) {
  const inviteURL = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${token}`;

  const message = {
    to,
    from: process.env.SENDGRID_FROM!,
    subject: "You're Invited 🎉",
    text: `Click to join: ${inviteURL}`,
    html: `
      <h2>🎉 You've been invited</h2>
      <p>Click below to accept invitation:</p>
      <a href="${inviteURL}" style="padding:10px 20px;background:#007bff;color:white;border-radius:6px;text-decoration:none;">
        Accept Invite
      </a>
     
     
    `
  };

  try {
    console.log("📨 Sending email to:", to);
    const result = await sgMail.send(message);
    console.log("✅ Email sent result:", result);
  } catch (err: any) {
    console.error("❌ SENDGRID ERROR:", err.response?.body || err.message);
  }
}export const authOptions: NextAuthOptions = {
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
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (user) {
        return true;
      }
      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
 