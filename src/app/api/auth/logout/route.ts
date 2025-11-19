import { signOut } from "next-auth/react";

signOut({ callbackUrl: "/login" });
