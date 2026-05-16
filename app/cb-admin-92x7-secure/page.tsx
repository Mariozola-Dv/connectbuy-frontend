"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Bell,
  Settings,
  Search
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [search, setSearch] = useState("");

  const COLORS = ["#6366f1", "#8b5cf6"];

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const crescimento = [
    { dia: "Seg", users: 2 },
    { dia: "Ter", users: 5 },
    { dia: "Qua", users: 8 },
    { dia: "Qui", users: 12 },
    { dia: "Sex", users: stats.users }
  ];

  const distribuicao = [
    { name: "Usuários", value: stats.users },
    { name: "Produtos", value: stats.products }
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-white">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] border-r border-white/10 p-6">

        <h1 className="text-2xl font-bold text-indigo-400">
          Admin ConnectBuy
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Centro de Controle
        </p>

        {/* SEARCH */}
        <div className="mt-6 flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
          <Search size={16} className="text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* MENU */}
        <nav className="mt-8 space-y-3 text-sm">

          <MenuItem
            icon={<LayoutDashboard size={16} />}
            label="Painel"
            href="/cb-admin-92x7-secure"
          />

          <MenuItem
            icon={<Users size={16} />}
            label="Utilizadores"
            href="/cb-admin-92x7-secure/users"
          />

          <MenuItem
            icon={<ShoppingBag size={16} />}
            label="Produtos"
            href="/cb-admin-92x7-secure/products"
          />

          <MenuItem
            icon={<CreditCard size={16} />}
            label="Pagamentos"
            href="#"
          />

          <MenuItem
            icon={<AlertTriangle size={16} />}
            label="Denúncias"
            href="#"
          />

          <MenuItem
            icon={<Bell size={16} />}
            label="Notificações"
            href="#"
          />

          <MenuItem
            icon={<Settings size={16} />}
            label="Configurações"
            href="#"
          />

        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 space-y-6">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-3xl font-bold">
              Painel de Controlo
            </h2>

            <p className="text-gray-400 text-sm">
              Estatísticas em tempo real da plataforma
            </p>
          </div>

          <div className="text-xs text-gray-400">
            Sistema: <span className="text-green-400">Online</span>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-5">

          <Card title="Total de Utilizadores" value={stats.users} color="text-indigo-400" />
          <Card title="Total de Produtos" value={stats.products} color="text-purple-400" />
          <Card title="Receita" value="0 Kz" color="text-green-400" />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">

            <h3 className="mb-4 text-indigo-300 font-semibold">
              Crescimento de Utilizadores
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={crescimento}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />

                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">

            <h3 className="mb-4 text-purple-300 font-semibold">
              Distribuição do Sistema
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={distribuicao} dataKey="value" outerRadius={90}>
                  {distribuicao.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </main>

    </div>
  );
}

/* COMPONENTS */

function MenuItem({ icon, label, href }: any) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-2 p-2 rounded hover:bg-indigo-500/20 cursor-pointer transition">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}