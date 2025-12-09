"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("LoginPage");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Rate limit error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("429")) {
        event.preventDefault();
        setErrorMsg(t("rateLimited"));
      }
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setErrorMsg(t("invalid"));
      return;
    }

    router.push("/dashboard");
  }

  return (
    
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0A0F1F] to-gray-900 text-white">

    {/* Language Switcher */}
    <div className="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>

    <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md">

      <h2 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
        {t("welcome")}
      </h2>
      <p className="text-center text-gray-300 text-sm mb-8">
        {t("subtitle")}
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm">{t("email")}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-3 rounded-lg bg-white/15 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-sm">{t("password")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-3 rounded-lg bg-white/15 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder={t("passwordPlaceholder")}
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400 p-2 rounded text-center text-red-300 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 transition-all py-3 rounded-lg font-semibold shadow-lg"
        >
          {t("loginButton")}
        </button>

        {/* NEW Sign Up Button */}
        <div className="text-center mt-4">
          <p className="text-gray-300 text-sm mb-1">{t("noAccount")}</p>
          <a
            href="/auth/signup"
            className="inline-block bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all shadow-md"
          >
            {t("createAccount")}
          </a>
        </div>
      </form>
    </div>
  </div>
);

  
}
