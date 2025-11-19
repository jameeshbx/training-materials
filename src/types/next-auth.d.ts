import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: "USER" | "ADMIN";   // 👈 Prisma enum
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "USER" | "ADMIN"; // 👈 Prisma enum
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN"; // 👈 Prisma enum
  }
}
