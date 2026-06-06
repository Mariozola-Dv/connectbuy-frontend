"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Search,
  Smartphone,
  Car,
  Shirt,
  House,
  Gamepad2,
  BookOpen,
  Dumbbell,
  Sparkles,
  Wrench,
  Package,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://connectbuy-backend-production.up.railway.app";

  // 📷 CATEGORIAS (NOVO)
  const categories = [
    { name: "Eletrónicos", icon: Smartphone },
    { name: "Veículos", icon: Car },
    { name: "Moda", icon: Shirt },
    { name: "Casa", icon: House },
    { name: "Gaming", icon: Gamepad2 },
    { name: "Educação", icon: BookOpen },
    { name: "Desporto", icon: Dumbbell },
    { name: "Beleza", icon: Sparkles },
    { name: "Ferramentas", icon: Wrench },
    { name: "Acessórios", icon: Package },
  ];

  // 📷 ABRIR CÂMERA / GALERIA
  const openCamera = () => {
    imageInputRef.current?.click();
  };

  // 📷 ENVIAR IMAGEM PARA BACKEND (VISION)
  const handleImageSearch = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/vision/search`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("🔥 Vision result:", data);

      if (data?.products?.length > 0) {
        setProducts(data.products);
      } else {
        alert("Nenhum produto encontrado");
      }
    } catch (error) {
      console.error("Erro na visão:", error);
      alert("Erro ao processar imagem");
    }
  };

  // 📷 SELEÇÃO DE IMAGEM
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleImageSearch(file);
  };

  // 📦 CARREGAR PRODUTOS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : [];

        setProducts(list);
      } catch (error) {
        console.log("Erro ao carregar produtos:", error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // 🎥 VIDEO FIX
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
        setVideoReady(true);
      } catch {
        setVideoReady(false);
      }
    };

    const timer = setTimeout(() => tryPlay(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* INPUT CÂMERA */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-purple-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-3">

          <h1 className="text-xl font-bold">
            <span className="text-blue-600">Connect</span>
            <span className="text-purple-600">Buy</span>
          </h1>

          <div className="flex-1 hidden md:flex items-center border border-purple-400 rounded-xl overflow-hidden">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar produto..."
              className="w-full px-4 py-2 outline-none"
            />
            <button className="px-4 text-purple-600 hover:bg-purple-600 hover:text-white">
              <Search size={20} />
            </button>
          </div>

          <nav className="hidden md:flex gap-3 items-center">

            <button
              onClick={openCamera}
              className="px-3 py-2 border border-purple-500 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white"
            >
              <Camera size={20} />
            </button>

            <Link href="/login" className="px-3 py-2 bg-purple-600 text-white rounded-xl">
              Entrar
            </Link>

            <Link href="/register" className="px-3 py-2 border border-purple-600 text-purple-600 rounded-xl">
              Cadastrar
            </Link>

          </nav>

          <button
            className="md:hidden text-3xl text-purple-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-4 pb-4">

            <div className="flex border rounded-xl mt-4">
              <input className="w-full px-4 py-2 outline-none" placeholder="Pesquisar..." />
              <button className="px-4 text-purple-600">
                <Search size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4">

              <button onClick={openCamera} className="py-3 border border-purple-500 text-purple-600 rounded-xl">
                📷 Pesquisar por imagem
              </button>

              <Link href="/login" className="py-3 bg-purple-600 text-white rounded-xl text-center">
                Entrar
              </Link>

              <Link href="/register" className="py-3 border border-purple-600 text-purple-600 rounded-xl text-center">
                Cadastrar
              </Link>

            </div>

          </div>
        )}
      </header>

      {/* HERO */}
      <section className="pt-20">
        <div className="relative h-[420px] md:h-[520px] bg-black">

          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dbbqvgvrh/video/upload/v1777753077/a_procura_ce2n1m.mp4"
            />
          </video>

          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              A carregar vídeo...
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-bold text-white">
              Compra. Vende. Conecta.
            </h2>
            <p className="text-white/80 mt-3">
              Pesquisa por texto ou imagem
            </p>
          </div>

        </div>
      </section>

      {/* CATEGORIAS (NOVO) */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <h3 className="text-xl font-bold text-purple-700 mb-6">
          Categorias
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <button
                key={i}
                className="group bg-white border border-purple-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="w-14 h-14 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600">
                  <Icon className="text-purple-600 group-hover:text-white" />
                </div>

                <span className="text-sm font-semibold group-hover:text-purple-700">
                  {cat.name}
                </span>
              </button>
            );
          })}

        </div>
      </section>

      {/* FEED */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <h3 className="text-lg font-semibold text-purple-700 border-l-4 border-purple-500 pl-2">
          Produtos em destaque
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {products.map((p, index) => (
            <div key={p?.id || index} className="bg-white rounded-2xl shadow overflow-hidden">

              <img src={p?.imageUrl || "/placeholder.png"} className="h-52 w-full object-cover" />

              <div className="p-4">
                <h4 className="font-semibold">{p?.title}</h4>
                <p className="text-purple-600 font-bold">{p?.price} Kz</p>

                <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-xl">
                  Conversar com vendedor
                </button>
              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}