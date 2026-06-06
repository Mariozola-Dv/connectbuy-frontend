"use client";

import { useEffect, useState } from "react";
import {
  Search,
  User,
  Trash2,
  Shield,
  ShieldOff,
  X,
} from "lucide-react";

type UserType = {
  id: string;
  email: string;
  isBanned: boolean;
  profile?: {
    fullName?: string;
    imageUrl?: string;
    bio?: string;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // 📥 LOAD USERS
  const loadUsers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔍 FILTER
  const filteredUsers = users.filter((u) => {
    const name = u.profile?.fullName?.toLowerCase() || "";
    const email = u.email.toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  // 🚫 BAN
  const banUser = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/ban`, {
      method: "PATCH",
    });
    loadUsers();
  };

  // ✅ UNBAN
  const unbanUser = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/unban`, {
      method: "PATCH",
    });
    loadUsers();
  };

  // 🗑 DELETE
  const deleteUser = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
    });
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-indigo-400">
          Gestão de Utilizadores
        </h1>

        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10 w-80">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar utilizadores..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border-b border-white/10 hover:bg-white/5 transition"
          >

            {/* INFO */}
            <div className="flex items-center gap-3">

              {user.profile?.imageUrl ? (
                <img
                  src={user.profile.imageUrl}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
              )}

              <div>
                <p className="font-semibold">
                  {user.profile?.fullName || "Sem nome"}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* STATUS */}
            <div className="text-xs">
              {user.isBanned ? (
                <span className="text-red-400">BANNED</span>
              ) : (
                <span className="text-green-400">ACTIVE</span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              <button
                onClick={() => setSelectedUser(user)}
                className="px-3 py-1 bg-indigo-600 rounded text-xs"
              >
                Ver
              </button>

              {user.isBanned ? (
                <button
                  onClick={() => unbanUser(user.id)}
                  className="p-2 bg-green-600 rounded"
                >
                  <ShieldOff size={14} />
                </button>
              ) : (
                <button
                  onClick={() => banUser(user.id)}
                  className="p-2 bg-yellow-600 rounded"
                >
                  <Shield size={14} />
                </button>
              )}

              <button
                onClick={() => deleteUser(user.id)}
                className="p-2 bg-red-600 rounded"
              >
                <Trash2 size={14} />
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* MODAL PERFIL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#111827] w-[400px] p-6 rounded-xl border border-white/10">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Perfil do Utilizador</h2>
              <button onClick={() => setSelectedUser(null)}>
                <X />
              </button>
            </div>

            {selectedUser.profile?.imageUrl && (
              <img
                src={selectedUser.profile.imageUrl}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
            )}

            <p className="text-center font-semibold">
              {selectedUser.profile?.fullName}
            </p>

            <p className="text-center text-xs text-gray-400 mb-2">
              {selectedUser.email}
            </p>

            <p className="text-sm text-gray-300 text-center">
              {selectedUser.profile?.bio || "Sem bio"}
            </p>

            <div className="mt-4 flex justify-center gap-2">

              <button
                onClick={() => banUser(selectedUser.id)}
                className="bg-yellow-600 px-3 py-1 rounded text-sm"
              >
                Banir
              </button>

              <button
                onClick={() => deleteUser(selectedUser.id)}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Eliminar
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}