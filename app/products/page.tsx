"use client";

import { useState } from "react";
import axios from "axios";

const CLOUD_NAME = "dbbqvgvrh";
const UPLOAD_PRESET = "connectbuy";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Product() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ☁️ UPLOAD CLOUDINARY
  const uploadImage = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      return res.data.secure_url;
    } catch (error) {
      alert("Erro ao enviar imagem");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // 📦 PUBLICAR
  const submit = async () => {
    if (!title || !price || !imageUrl) {
      alert("Preenche todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const userRaw = localStorage.getItem("user");

      if (!userRaw) {
        alert("Faça login primeiro");
        return;
      }

      const user = JSON.parse(userRaw);
      const userId = user?.id;

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          description,
          imageUrl,
          userId,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Erro ao publicar");
        return;
      }

      alert("Produto publicado com sucesso!");

      setTitle("");
      setPrice("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-purple-100 p-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">

        {/* HEADER PREMIUM */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            Publicar Produto
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Adicione um produto ao ConnectBuy
          </p>
        </div>

        <div className="p-6 space-y-4">

          {/* INPUTS PREMIUM */}
          <input
            className="w-full p-3 border-2 border-gray-200 rounded-xl text-black font-medium focus:border-purple-500 focus:outline-none"
            placeholder="Nome do produto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full p-3 border-2 border-gray-200 rounded-xl text-black font-medium focus:border-purple-500 focus:outline-none"
            placeholder="Preço (Kz)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            className="w-full p-3 border-2 border-gray-200 rounded-xl text-black font-medium h-28 focus:border-purple-500 focus:outline-none"
            placeholder="Descrição do produto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* UPLOAD AREA PREMIUM */}
          <label className="cursor-pointer block">

            <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-500 transition bg-purple-50">

              <div className="text-purple-600 text-4xl mb-2">📷</div>

              <p className="font-semibold text-black">
                Clique para adicionar imagem
              </p>

              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG ou JPEG
              </p>

              {uploading && (
                <p className="text-purple-600 mt-2 font-medium">
                  A enviar imagem...
                </p>
              )}

            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = await uploadImage(file);
                if (url) setImageUrl(url);
              }}
            />
          </label>

          {/* PREVIEW */}
          {imageUrl && (
            <img
              src={imageUrl}
              className="w-full h-52 object-cover rounded-2xl border"
            />
          )}

          {/* BUTTON PREMIUM */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Publicando..." : "Publicar Produto"}
          </button>

        </div>
      </div>
    </div>
  );
}