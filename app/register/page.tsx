"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro ao criar conta");
        return;
      }

      alert("Conta criada com sucesso!");
      router.push("/login");

    } catch (error) {
      alert("Erro de conexão com o servidor");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">

        <h1 className="text-2xl font-bold text-center mb-6">
          Criar Conta
        </h1>

        <input
          className="w-full mb-3 px-3 py-2 border rounded-xl"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 px-3 py-2 border rounded-xl"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 px-3 py-2 border rounded-xl"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
        >
          Cadastrar
        </button>

      </div>

    </div>
  );
}