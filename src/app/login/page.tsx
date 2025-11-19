// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // signIn returns a Promise that resolves to an object when redirect: false
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErr(res.error);
      return;
    }

    // successful sign in: navigate to dashboard
// Fetch session to get user role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;
    console.log("User role:", role);

    if (role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }  };

  return (
    <div
  style={{
    maxWidth: 420,
    margin: "5rem auto",
    padding: "2rem",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    color: "#000",
    fontFamily: "Arial, sans-serif",
  }}
>
  <h1 style={{ textAlign: "center", marginBottom: "1.5rem",fontStyle:"-moz-initial" }}>Login</h1>

  <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        required
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      />
    </div>

    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        required
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      />
    </div>

    <button
      type="submit"
      style={{
        width: "100%",
        padding: "12px 0",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 16,
        cursor: "pointer",
        marginTop: 8,
      }}
    >
      LOGIN
    </button>

    {err && (
      <p style={{ color: "red", marginTop: 12, textAlign: "center" }}>{err}</p>
    )}
  </form>
</div>

  );
}
