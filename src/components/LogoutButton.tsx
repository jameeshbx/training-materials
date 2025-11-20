"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
