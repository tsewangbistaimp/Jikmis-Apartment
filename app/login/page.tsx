"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@jikmis.com");
  const [password, setPassword] = useState("admin12345");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const data = await api<{ token: string; user: { role: string; name: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("jikmis_token", data.token);
      localStorage.setItem("jikmis_user", JSON.stringify(data.user));
      window.location.href = data.user.role === "ADMIN" ? "/admin" : "/dashboard";
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return <Auth title="Login" onSubmit={submit} message={message}><label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="button primary">Login</button><Link className="text-link" href="/register">Create account</Link></Auth>;
}

function Auth({ title, children, message, onSubmit }: { title: string; children: React.ReactNode; message: string; onSubmit: (event: React.FormEvent) => void }) {
  return <main><section className="auth-shell"><Link className="brand" href="/"><span className="brand-mark">JA</span><span>Jikmis Apartment</span></Link><h1>{title}</h1><form className="form-grid" onSubmit={onSubmit}>{children}</form>{message && <p className="message error">{message}</p>}</section></main>;
}
