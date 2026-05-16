"use client";

import { useState } from "react";
import axios from "axios";

const CLOUD_NAME = "dbbqvgvrh";
const UPLOAD_PRESET = "connectbuy";

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
      console.log(error);
      alert("Erro ao enviar imagem");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // 📦 PUBLICAR PRODUTO (VERSÃO SEGURA)
  const submit = async () => {
    if (!title || !price || !imageUrl) {
      alert("Preenche todos os campos!");
      return;
    }

    setLoading(true);

    try {
      // 🔥 PEGAR USER DO LOCALSTORAGE
      const userRaw = localStorage.getItem("user");

      if (!userRaw) {
        alert("Você precisa fazer login primeiro");
        return;
      }

      let user;

      try {
        user = JSON.parse(userRaw);
      } catch {
        alert("Sessão inválida. Faça login novamente");
        return;
      }

      const userId = user?.id;

      if (!userId) {
        alert("User inválido. Faça login novamente");
        return;
      }

      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          description,
          imageUrl,
          userId: userId, // 🔥 ISSO RESOLVE O ERRO
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.log(data);
        alert(data?.message || "Erro ao publicar produto");
        return;
      }

      alert("🔥 Produto publicado com sucesso!");

      setTitle("");
      setPrice("");
      setDescription("");
      setImageUrl("");

    } catch (error) {
      console.log(error);
      alert("Erro de conexão com servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 p-6">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">

        <h1 className="text-3xl font-bold text-center mb-6">
          Publicar Produto
        </h1>

        <input
          className="w-full p-3 border rounded-xl mb-3"
          placeholder="Nome do produto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl mb-3"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded-xl mb-3 h-28"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = await uploadImage(file);
            if (url) setImageUrl(url);
          }}
        />

        {uploading && (
          <p className="text-purple-600">A enviar imagem...</p>
        )}

        {imageUrl && (
          <img
            src={imageUrl}
            className="w-full h-48 object-cover rounded-xl mt-3"
          />
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>

      </div>
    </div>
  );
}