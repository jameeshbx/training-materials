import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "ADMIN" | "USER";
      name: string;
      email: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    role: "ADMIN" | "USER";
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "ADMIN" | "USER";
    name: string;
    email: string;
  }
}
