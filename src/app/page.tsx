
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const user: User = {
    id: "1",
    name: "Gokul",
    email: "gokul@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-blue-600">
            Welcome, {user.name}! 👋
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-500 text-center">
            Your email: {user.email}
          </p>

          {/* Input fields */}
          <Input placeholder="Enter your name" />
          <Input type="email" placeholder="Enter your email" />

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Submit
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
