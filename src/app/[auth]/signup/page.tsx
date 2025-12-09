"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("SignupPage");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to register");
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      setErrorMsg("Network error, try again");
    }
  }

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0A0F1F] to-gray-900 text-white">
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

       <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          {t("title")}
        </h2>
        <p className="text-center text-gray-300 text-sm mb-6">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSignup} className="space-y-1">
          
          <div>
            <label className="text-sm">{t("name")}</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-lg bg-white/15 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-sm">{t("email")}</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-lg bg-white/15 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-sm">{t("password")}</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-lg bg-white/15 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-sm">{t("role")}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-lg bg-white text-black border"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 transition-all py-3 rounded-lg font-semibold shadow-lg"
          >
            {t("signupButton")}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-300 text-sm">{t("haveAccount")}</p>
            <a
              href="/auth/login"
              className="inline-block bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all shadow-md mt-2"
            >
              {t("login")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
