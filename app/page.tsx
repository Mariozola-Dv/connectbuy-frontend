"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Search,
  Smartphone,
  Car,
  Shirt,
  Home as House,
  Gamepad2,
  BookOpen,
  Dumbbell,
  Sparkles,
  Wrench,
  Package,
  ShoppingCart,
  Building2,
  Laptop,
  Sofa,
  Apple,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [visionResults, setVisionResults] = useState<any[]>([]);

  const [videoReady, setVideoReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 🔥 VANESSA AI STATES (UPGRADED)
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionStep, setVisionStep] = useState("idle");
  const [vanessaStage, setVanessaStage] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://connectbuy-backend-production.up.railway.app";

  const categories = [
    { name: "Eletrónicos", icon: Smartphone },
    { name: "Telemóveis", icon: Smartphone },
    { name: "Computadores", icon: Laptop },
    { name: "Veículos", icon: Car },
    { name: "Moda", icon: Shirt },
    { name: "Casa", icon: House },
    { name: "Imóveis", icon: Building2 },
    { name: "Móveis", icon: Sofa },
    { name: "Gaming", icon: Gamepad2 },
    { name: "Educação", icon: BookOpen },
    { name: "Desporto", icon: Dumbbell },
    { name: "Beleza", icon: Sparkles },
    { name: "Ferramentas", icon: Wrench },
    { name: "Acessórios", icon: Package },
    { name: "Alimentação", icon: Apple },
  ];

  const openCamera = () => {
    imageInputRef.current?.click();
  };

  // 🔥 VANESSA AI IMAGE PROCESSING (PROFESSIONAL FLOW)
  const handleImageSearch = async (file: File) => {
    try {
      setVisionLoading(true);
      setVisionStep("booting");
      setVanessaStage(0);

      const formData = new FormData();
      formData.append("image", file);

      // 🧠 SIMULAÇÃO DE "BOOT DA VANESSA IA"
      const interval = setInterval(() => {
        setVanessaStage((prev) => {
          if (prev < 3) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 600);

      setTimeout(() => setVisionStep("uploading"), 600);
      setTimeout(() => setVisionStep("analyzing"), 1400);
      setTimeout(() => setVisionStep("scanning"), 2200);

      const res = await fetch(`${API_URL}/vision/search`, {
        method: "POST",
        body: formData,
      });

      setVisionStep("matching");

      const data = await res.json();

      const results =
        data?.products ||
        data?.results ||
        data ||
        [];

      setVisionResults(Array.isArray(results) ? results : []);

      setVisionStep("complete");

      setTimeout(() => {
        setVisionLoading(false);
        setVisionStep("idle");
        setVanessaStage(0);
      }, 1200);

    } catch (err) {
      console.error("Vision error:", err);
      setVisionResults([]);
      setVisionLoading(false);
      setVisionStep("idle");
      setVanessaStage(0);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageSearch(file);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch {
        setProducts([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
        setVideoReady(true);
      } catch {
        setVideoReady(false);
      }
    };

    setTimeout(play, 300);
  }, []);

  const displayProducts =
    visionResults.length > 0 ? visionResults : products;

  return (
    <div className="min-h-screen bg-white">

      {/* INPUT CAMERA */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* 🔥 VANESSA AI OVERLAY (ULTRA PROFESSIONAL) */}
      {visionLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white w-80 p-6 rounded-2xl text-center shadow-2xl border border-purple-300">

            {/* Boot Animation */}
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            </div>

            {/* Vanessa AI Title */}
            <h2 className="text-purple-700 font-bold text-lg mb-2">
              Vanessa AI Vision
            </h2>

            {/* Stage Text */}
            <p className="text-sm text-gray-700 font-medium min-h-[24px]">
              {visionStep === "booting" && "Inicializando sistema de visão..."}
              {visionStep === "uploading" && "A enviar imagem para análise..."}
              {visionStep === "analyzing" && "Vanessa está a analisar padrões visuais..."}
              {visionStep === "scanning" && "A escanear produtos no mercado..."}
              {visionStep === "matching" && "A encontrar correspondências..."}
              {visionStep === "complete" && "Análise concluída com sucesso!"}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="h-2 bg-purple-600 transition-all duration-500"
                style={{ width: `${vanessaStage * 33}%` }}
              />
            </div>

          </div>
        </div>
      )}

      {/* NAVBAR (INTOCADO) */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-purple-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

          <h1 className="text-xl font-bold">
            <span className="text-blue-600">Connect</span>
            <span className="text-purple-600">Buy</span>
          </h1>

          <div className="flex-1 hidden md:flex items-center border border-purple-400 rounded-xl overflow-hidden bg-white">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar produto..."
              className="w-full px-4 py-2 outline-none text-black"
            />
            <button className="px-4 text-purple-600 hover:bg-purple-600 hover:text-white">
              <Search size={20} />
            </button>
          </div>

          <nav className="hidden md:flex gap-3 items-center">

            <button
              onClick={openCamera}
              className="px-3 py-2 border border-purple-500 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition"
            >
              <Camera size={20} />
            </button>

            <button className="relative px-3 py-2 rounded-xl border border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
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

        {/* MOBILE MENU (INTOCADO) */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-purple-300 px-4 pb-4">

            <div className="flex border border-purple-400 rounded-xl mt-4 bg-white">
              <input
                className="w-full px-4 py-2 outline-none text-black"
                placeholder="Pesquisar..."
              />
              <button className="px-4 text-purple-600">
                <Search size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4">

              <button
                onClick={openCamera}
                className="flex items-center justify-center gap-2 py-3 border border-purple-500 text-purple-600 rounded-xl bg-white"
              >
                <Camera size={20} />
                Pesquisar por imagem
              </button>

              <button className="py-3 border border-purple-500 text-purple-600 rounded-xl">
                <ShoppingCart size={20} className="inline mr-2" />
                Carrinho ({cartCount})
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

      {/* FEED (INTOCADO) */}
      <section className="max-w-6xl mx-auto px-4 mt-32">

        <h3 className="text-lg font-semibold text-purple-700 border-l-4 border-purple-500 pl-2">
          {visionResults.length > 0
            ? "Resultados da Vanessa AI"
            : "Produtos em destaque"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {displayProducts.map((p, i) => (
            <div key={i} className="bg-white shadow rounded-2xl overflow-hidden">

              <img
                src={p?.imageUrl || "/placeholder.png"}
                className="h-52 w-full object-cover"
              />

              <div className="flex items-center gap-2 px-4 pt-3">
                <img
                  src={p?.user?.profile?.imageUrl || "/avatar.png"}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="text-sm font-medium text-black">
                  {p?.user?.profile?.fullName || "Vendedor"}
                </span>
              </div>

              <div className="px-4 mt-1">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p?.description || "Sem descrição"}
                </p>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-black">{p?.title}</h4>
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