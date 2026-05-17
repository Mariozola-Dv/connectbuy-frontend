"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/api"; // 🔥 IMPORT CORRIGIDO

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

  // ✅ UPLOAD REAL PARA CLOUDINARY
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
      console.log("Erro upload:", err);
      alert("Erro ao enviar imagem");
    } finally {
      setLoadingImage(false);
    }
  };

  // ✅ CARREGAR PERFIL
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

  // ✅ SALVAR
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-center">

          <h1 className="text-xl font-bold">👤 Meu Perfil</h1>

          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="bg-white text-blue-600 px-4 py-2 rounded-xl">
              Editar
            </button>
          ) : (
            <button onClick={save} className="bg-white text-purple-600 px-4 py-2 rounded-xl">
              Salvar
            </button>
          )}

        </div>

        <div className="p-8">

          <div className="flex flex-col items-center mb-8">

            <div
              onClick={editMode ? openFile : undefined}
              className="w-32 h-32 rounded-full border-4 border-purple-500 overflow-hidden cursor-pointer bg-gray-100"
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Sem foto</span>
              )}
            </div>

            <input type="file" ref={fileRef} onChange={handleImage} hidden />
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input disabled={!editMode} value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded-xl" />

            <input disabled={!editMode} type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="p-3 border rounded-xl" />

            <select disabled={!editMode} value={gender} onChange={(e) => setGender(e.target.value)} className="p-3 border rounded-xl md:col-span-2">
              <option value="">Selecione o género</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>

            <textarea disabled={!editMode} value={bio} onChange={(e) => setBio(e.target.value)} className="p-3 border rounded-xl md:col-span-2 h-28" />

          </div>

        </div>
      </div>
    </div>
  );
}