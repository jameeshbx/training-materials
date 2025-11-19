import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: string;   // ⭐ Add role to User type
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;   // ⭐ Add role to Session type
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;   // ⭐ Add role to JWT type
    }
}
