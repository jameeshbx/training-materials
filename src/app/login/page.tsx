"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

export default function LoginPage() {
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [messages, setMessages] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setMessages(locale === "es" ? esMessages : enMessages);
  }, [locale]);

  const t = (key: string) => messages?.auth?.[key] || key;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErr(res.error);
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "ADMIN") router.push("/admin");
    else router.push("/dashboard");
  };

  if (!messages) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-white to-slate-200">

      {/* ✅ Language switcher */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setLocale("en")}
          className={`px-3 py-1 rounded ${
            locale === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLocale("es")}
          className={`px-3 py-1 rounded ${
            locale === "es" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ES
        </button>
      </div>

      {/* Skip link */}
      <a href="#login-form" className="sr-only focus:not-sr-only">
        Skip to login form
      </a>

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center relative">
        <img
          src="https://img.freepik.com/premium-photo/user-typing-login-password-home-secure-access-personal-information-big-data-cyber-security-digital-crime-concept-data-protection-from-hackers_144352-850.jpg"
          alt={t("welcomeBack")}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 border">

          <h1 id="login-form" className="text-3xl font-bold text-center">
            {t("login")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <input
              type="email"
              required
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-3 rounded-xl"
            />

            <input
              type="password"
              required
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-3 rounded-xl"
            />

            {err && <p className="text-red-500 text-center">{err}</p>}

            <button className="w-full bg-gray-900 text-white py-3 rounded-xl">
              {t("login")}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            {t("newHere")}{" "}
            <Link href="/signup" className="font-semibold">
              {t("createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
