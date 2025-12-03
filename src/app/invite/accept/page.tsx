// src/app/invite/accept/page.tsx
import { Suspense } from "react";
import AcceptInviteClient from "./AcceptInviteClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <p>Loading invite...</p>
        </div>
      }
    >
      <AcceptInviteClient />
    </Suspense>
  );
}
