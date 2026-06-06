"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/api";

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const openFile = () => fileRef.current?.click();

  // ☁️ UPLOAD CLOUDINARY
  const handleImage = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingImage(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "connectbuy");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbbqvgvrh/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImage(data.secure_url);
      }
    } catch (err) {
      alert("Erro ao enviar imagem");
    } finally {
      setLoadingImage(false);
    }
  };

  // 📦 LOAD PROFILE
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setName(data.fullName || "");
      setBirthdate(data.birthdate?.split("T")[0] || "");
      setGender(data.gender || "");
      setBio(data.bio || "");
      setImage(data.imageUrl || null);
    };

    load();
  }, []);

  // 💾 SAVE
  const save = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: name,
        birthdate,
        gender,
        bio,
        imageUrl: image,
      }),
    });

    if (res.ok) {
      setEditMode(false);
      alert("Perfil atualizado 🚀");
    } else {
      alert("Erro ao salvar perfil");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-purple-100 p-4">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">

        {/* HEADER PREMIUM */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">

          <h1 className="text-xl font-bold text-white">
            👤 Meu Perfil
          </h1>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:opacity-90"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={save}
              className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:opacity-90"
            >
              Salvar
            </button>
          )}

        </div>

        <div className="p-6 md:p-10">

          {/* AVATAR PREMIUM */}
          <div className="flex flex-col items-center mb-8">

            <div
              onClick={editMode ? openFile : undefined}
              className="relative w-36 h-36 rounded-full border-4 border-purple-500 overflow-hidden bg-gray-100 cursor-pointer shadow-lg"
            >
              {image ? (
                <img
                  src={image}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Sem foto
                </div>
              )}

              {/* overlay upload hint */}
              {editMode && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition">
                  Alterar foto
                </div>
              )}
            </div>

            {loadingImage && (
              <p className="text-purple-600 mt-2 text-sm font-medium">
                A carregar imagem...
              </p>
            )}

            <input type="file" ref={fileRef} onChange={handleImage} hidden />
          </div>

          {/* FORM PREMIUM */}
          <div className="grid md:grid-cols-2 gap-4">

            <input
              disabled={!editMode}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="p-3 border-2 border-gray-200 rounded-xl text-black font-medium focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
            />

            <input
              disabled={!editMode}
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-xl text-black font-medium focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
            />

            <select
              disabled={!editMode}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-xl text-black font-medium md:col-span-2 focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
            >
              <option value="">Selecione o género</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>

            <textarea
              disabled={!editMode}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escreve algo sobre ti..."
              className="p-3 border-2 border-gray-200 rounded-xl text-black font-medium md:col-span-2 h-28 focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
            />

          </div>

        </div>
      </div>
    </div>
  );
}