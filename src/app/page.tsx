"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Card
        title="NEXT APP"
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
      >
        
        <h1 >WELCOME.</h1>
      </Card>
    </main>
  );
}

// import { redirect } from "next/navigation";

// export default function Home() {
//   redirect("/");
// }
