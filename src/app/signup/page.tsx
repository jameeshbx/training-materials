"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

export default function Signup() {
  // ✅ Language state
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [messages, setMessages] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const router = useRouter();

  // ✅ Load messages (same logic as dashboard)
  useEffect(() => {
    setMessages(locale === "es" ? esMessages : enMessages);
  }, [locale]);

  // ✅ Translation helper
  const t = (key: string) => messages?.auth?.[key] || key;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/login");
  };

  if (!messages) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-white to-slate-200 text-black">

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

      {/* Skip Link */}
      <a href="#signup-form" className="sr-only focus:not-sr-only">
        Skip to signup form
      </a>

      {/* LEFT BRANDING */}
      <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center relative">
        <img
          src="/signup-bg.jpg"
          alt={t("signupBannerTitle")}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="relative z-10 text-white text-center px-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            {t("signupBannerTitle")}
          </h1>
          <p className="text-gray-200 text-lg">
            {t("signupBannerDesc")}
          </p>
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-slate-200">

          <div className="text-center mb-6">
            <h2 id="signup-form" className="text-3xl font-bold text-gray-900">
              {t("createAccount")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("signupSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder={t("fullName")}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border px-4 py-2.5"
            />

            <input
              type="email"
              placeholder={t("email")}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border px-4 py-2.5"
            />

            <input
              type="password"
              placeholder={t("password")}
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border px-4 py-2.5"
            />

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border px-4 py-2.5"
            >
              <option value="USER">{t("user")}</option>
              <option value="ADMIN">{t("admin")}</option>
            </select>

            <button className="w-full bg-gray-900 text-white py-3 rounded-xl">
              {t("createAccount")}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            {t("alreadyAccount")}{" "}
            <Link href="/login" className="font-semibold">
              {t("login")}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
