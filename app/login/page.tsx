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

      // 🔥 API PRODUÇÃO
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

      // 🔥 GUARDA TOKEN
      localStorage.setItem("token", data.access_token);

      // 🔥 GUARDA USER
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          ConnectBuy
        </h1>

        <p className="text-center text-white/70 mb-6">
          Faça login na sua conta
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-5 p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-white text-blue-600 hover:scale-105 hover:bg-gray-100 active:scale-95"
          }`}
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