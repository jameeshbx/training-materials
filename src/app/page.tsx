
// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";

// export default function Home() {
//   return (
//     // <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
//     // <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full">
//     <div className="flex items-center justify-center w-full">

//       <Card
//         title="Sign In"
//         className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
//       >
//         <div className="space-y-5">
//           <Input
//             placeholder="Email"
//             type="email"
//             className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
//           />
//           <Input
//             placeholder="Password"
//             type="password"
//             className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
//           />

//           <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
//             Login
//           </Button>


//           <Link href="/register" className="block">
//             <Button
//               variant="secondary"
//               className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold"
//             >
//               Register
//             </Button>
//           </Link>
//         </div>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    // Fetch session to get user role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Card
        title="Sign In"
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-6"
      >
        <div className="space-y-5">
          <Input
            placeholder="Email"
            type="email"
            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-300 text-sm">{error}</p>
          )}

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            onClick={handleLogin}
          >
            Login
          </Button>

          <Link href="/register" className="block">
            <Button
              variant="secondary"
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold"
            >
              Register
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
