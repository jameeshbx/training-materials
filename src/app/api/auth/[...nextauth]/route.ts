import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest } from "next";

// ---------------------------
// AUDIT LOG HELPER
// ---------------------------
async function createAuditLog(req: NextApiRequest | undefined, params: {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: any;
  level?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId || null,
        actorEmail: params.actorEmail || null,
        actorRole: params.actorRole || null,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId || null,
        details: params.details || {},
        ip: req?.headers["x-forwarded-for"] as string || null,
        userAgent: req?.headers["user-agent"] as string || null,
        level: params.level || "info",
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}

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

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Create login activity
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
          console.error("Failed to create login activity:", error);
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

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Use `signIn` callback WITHOUT req, log in JWT callback instead
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.role = (user as any).role;

        // Audit log on login
        await createAuditLog(undefined, {
          actorId: (user as any).id,
          actorEmail: (user as any).email,
          actorRole: (user as any).role,
          action: "auth.login",
          resource: "user",
          resourceId: (user as any).id,
          details: { message: "User logged in successfully" },
        });
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

