
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    // <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
    // <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full">
    <div className="flex items-center justify-center w-full">

      <Card
        title="Sign In"
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
      >
        <div className="space-y-5">
          <Input
            placeholder="Email"
            type="email"
            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
          />
          <Input
            placeholder="Password"
            type="password"
            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
          />

          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
            Login
          </Button>

          <Button
            variant="secondary"
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold"
          >
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
}
