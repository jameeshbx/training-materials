
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// ✅ Local messages just for the login page
const LOGIN_MESSAGES = {
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
  },
  es: {
    login: "Iniciar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
  },
} as const;

type LoginLocale = keyof typeof LOGIN_MESSAGES;

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<LoginLocale>("en"); // ✅ purely client-side

  const t = (key: keyof (typeof LOGIN_MESSAGES)["en"]) =>
    LOGIN_MESSAGES[locale][key];

  async function handleLogin() {
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role,
    });

    if (res?.error === "RATE_LIMIT") {
      setError("Too many login attempts. Please try again in 1 minute.");
      return;
    }

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const userRole = session?.user?.role;

    if (userRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 sm:px-6">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-6 sm:p-8 rounded-lg sm:rounded-xl">

        {/* ✅ LANGUAGE SWITCH BUTTONS (pure client, no SSR issues) */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`px-3 py-1 text-sm rounded ${locale === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
              }`}
          >
            EN
          </button>

          <button
            type="button"
            onClick={() => setLocale("es")}
            className={`px-3 py-1 text-sm rounded ${locale === "es"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
              }`}
          >
            ES
          </button>
        </div>

        {/* ✅ TITLE */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">
          {t("login")}
        </h2>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* ✅ Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs sm:text-sm text-gray-100">
              {t("email")}
            </label>
            <Input
              id="email"
              placeholder={t("email")}
              type="email"
              className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ✅ Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs sm:text-sm text-gray-300">
              {t("password")}
            </label>
            <Input
              id="password"
              placeholder={t("password")}
              type="password"
              className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ✅ Error */}
          {error && (
            <p className="text-red-200 text-xs sm:text-sm" role="alert">
              {error}
            </p>
          )}

          {/* ✅ Login Button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3"
            onClick={handleLogin}
          >
            {t("login")}
          </Button>

          {/* ✅ Register */}
          <Link href="/register" className="block">
            <Button
              variant="secondary"
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 sm:py-3"
            >
              Register
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
