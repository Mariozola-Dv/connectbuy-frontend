"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  MessageSquare,
  Bell,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import { API_URL } from "@/lib/api";

type Profile = {
  fullName?: string;
  imageUrl?: string;
  isSeller?: boolean;
  user?: {
    email?: string;
  };
  email?: string; // 🔥 compatibilidade extra
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cb_theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("cb_theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json();

      // 🔥 CORREÇÃO SEGURA (NÃO QUEBRA DESIGN)
      setProfile({
        fullName: data.fullName,
        imageUrl: data.imageUrl,
        isSeller: data.isSeller,

        user: {
          email: data.user?.email || data.email || "",
        },
      });
    };

    load();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const modules = [
    { title: "Visão Geral", desc: "Resumo da conta", icon: LayoutDashboard, route: "/dashboard" },
    { title: "Perfil", desc: "Gerir dados", icon: User, route: "/profile" },
    { title: "Marketplace", desc: "Produtos e feed", icon: ShoppingBag, route: "/products" },
    { title: "Mensagens", desc: "Chat", icon: MessageSquare, route: "/chat" },
    { title: "Notificações", desc: "Alertas", icon: Bell, route: "/notifications" },
  ];

  const sellerModules = profile?.isSeller
    ? [{ title: "Painel Seller", desc: "Vendas", icon: ShoppingBag, route: "/seller" }]
    : [];

  const allModules = [...modules, ...sellerModules];

  const bg = dark ? "bg-[#0b0b12]" : "bg-[#f5f6fa]";
  const card = dark ? "bg-[#12121a]" : "bg-white";
  const sidebarBg = dark ? "bg-[#0f0f18]" : "bg-white";
  const text = dark ? "text-white" : "text-gray-900";
  const soft = dark ? "text-gray-400" : "text-gray-500";
  const border = dark ? "border-white/10" : "border-gray-200";

  return (
    <div className={`h-screen flex overflow-hidden ${bg} ${text}`}>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50 h-full w-72 border-r ${border} ${sidebarBg}
          flex flex-col
          transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        <div className={`p-6 border-b ${border} flex items-center justify-between`}>
          <div>
            <h1 className="text-xl font-bold">
              <span className="text-[#a855f7]">Connect</span>Buy
            </h1>
            <p className={`text-xs mt-1 ${soft}`}>Painel de Controlo</p>
          </div>

          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {allModules.map((m, i) => {
            const Icon = m.icon;

            return (
              <Link key={i} href={m.route}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#a855f7]/10 transition">
                  <Icon size={18} className="text-[#a855f7]" />
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className={`text-xs ${soft}`}>{m.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${border}`}>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
              {profile?.imageUrl && (
                <img src={profile.imageUrl} className="w-full h-full object-cover" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {profile?.fullName || "Utilizador"}
              </p>

              <p className={`text-xs ${soft}`}>
                {profile?.user?.email || "sem email"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg bg-[#a855f7] hover:bg-[#9333ea] transition"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-5 md:p-10">

        <div className="flex items-center justify-between mb-8">

          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu />
          </button>

          <h1 className="text-lg font-semibold">
            Painel de Controlo
          </h1>

          <button
            onClick={() => setDark(!dark)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${border} ${card}`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Claro" : "Escuro"}
          </button>
        </div>

        <div className={`${card} border ${border} p-6 md:p-8 rounded-2xl mb-8`}>
          <h2 className="text-xl md:text-2xl font-semibold">
            Seja bem-vindo,{" "}
            <span className="text-[#a855f7]">
              {profile?.fullName || "utilizador"}
            </span>
          </h2>

          <p className={`mt-1 ${soft}`}>
            Tudo está sincronizado e estável.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allModules.map((m, i) => {
            const Icon = m.icon;

            return (
              <Link key={i} href={m.route}>
                <div className={`${card} border ${border} rounded-2xl p-5 hover:scale-[1.02] transition`}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#a855f7]/10 text-[#a855f7] mb-3">
                    <Icon size={18} />
                  </div>

                  <h3 className="font-semibold">{m.title}</h3>
                  <p className={`text-sm mt-1 ${soft}`}>{m.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}