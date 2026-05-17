"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Preenche todos os campos");
      return;
    }

    try {
      setLoading(true);

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://connectbuy-backend-production.up.railway.app";

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.access_token) {
        alert(data?.message || "Credenciais inválidas");
        return;
      }

      localStorage.setItem("token", data.access_token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);
      }

      alert("Login realizado com sucesso!");
      router.push("/dashboard");

    } catch (error) {
      console.error("Erro login:", error);
      alert("Erro ao ligar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* 🌄 BACKGROUND CONNECTBUY (NEUTRO, MARKETPLACE) */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=60"
          className="w-full h-full object-cover"
          alt="marketplace background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />
      </div>

      {/* FORM */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          ConnectBuy
        </h1>

        <p className="text-center text-white/70 mb-6">
          Faça login na sua conta
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/70 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-5 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/70 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition transform ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] active:scale-95"
          } text-white`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-white/70 mt-6 text-sm">
          Não tem conta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Criar conta
          </span>
        </p>

      </div>

    </div>
  );
}