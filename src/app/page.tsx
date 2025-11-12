"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const user = {
    name: name || "Anirva",
    email: "anirva@example.com",
    joined: new Date().toDateString(),
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Welcome, <span className="text-blue-600">{user.name}</span> 👋
      </h1>

      

      <div className="flex items-center gap-3">
        <Input
          placeholder="Enter your name"
          className="w-60"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="default">Submit</Button>
      </div>

      <Card className="p-6 shadow-lg hover:shadow-xl transition-all rounded-2xl w-80 border border-blue-100">
        <h2 className="text-xl font-semibold text-white-800 mb-3">User Card</h2>
        <p className="text-white-600">Email: {user.email}</p>
        <p className="text-white-600">Joined: {user.joined}</p>
      </Card>

     
    </div>
  );
}
