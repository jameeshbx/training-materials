import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string; // 👈 role added here
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string; // 👈 role added here
  }
}