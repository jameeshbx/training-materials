"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 text-white">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <img
            src="https://images.unsplash.com/photo-1522199710521-72d69614c702"
            alt="Hero"
            className="w-full h-48 object-cover rounded-2xl shadow-lg"
          />

          <h1 className="text-4xl font-extrabold tracking-wide">Welcome to NEXT APP</h1>

          <p className="text-gray-300 text-lg max-w-md mx-auto">
            A modern, professional, fast and secure application built with Next.js.
            Let's get you started!
          </p>

          <div className="flex justify-center pt-2">
            <Button className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg">
              Get Started
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}