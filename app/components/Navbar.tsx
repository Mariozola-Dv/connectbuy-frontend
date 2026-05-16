"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white">

      {/* LOGO */}
      <div className="text-2xl font-bold">
        <span className="text-blue-600">Connect</span>
        <span className="text-purple-600">Buy</span>
      </div>

      {/* LINKS */}
      <div className="hidden md:flex gap-6 text-gray-600">
        <Link href="#">Explorar</Link>
        <Link href="#">Vender</Link>
        <Link href="#">Sobre</Link>
      </div>

      {/* BOTÕES */}
      <div className="flex gap-3 items-center">

        {!token ? (
          <>
            <Link href="/login">
              <button className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                Entrar
              </button>
            </Link>

            <Link href="/register">
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105">
                Criar conta
              </button>
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Sair
            </button>
          </>
        )}

      </div>
    </nav>
  );
}