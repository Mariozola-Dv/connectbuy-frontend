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

  // 🔥 VISION IA STATES (CORRIGIDO)
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionStep, setVisionStep] = useState("idle");
  const [visionResults, setVisionResults] = useState<any[]>([]);
  const [visionMode, setVisionMode] = useState(false);

  const [videoReady, setVideoReady] = useState(false);
  const [cartCount] = useState(0);

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

  // 🔥 CAMERA / VISION FIX TOTAL
  const handleImageSearch = async (file: File) => {
    try {
      setVisionLoading(true);
      setVisionMode(true);
      setVisionStep("uploading");

      const formData = new FormData();
      formData.append("image", file);

      setTimeout(() => setVisionStep("scanning"), 700);

      const res = await fetch(`${API_URL}/vision/search`, {
        method: "POST",
        body: formData,
      });

      setVisionStep("analyzing");

      const data = await res.json();

      const results = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setVisionResults(results);

      setVisionStep("done");

      setTimeout(() => {
        setVisionLoading(false);
        setVisionStep("idle");
      }, 900);

    } catch (err) {
      console.error("Vision error:", err);
      setVisionResults([]);
      setVisionMode(true);
      setVisionLoading(false);
      setVisionStep("idle");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageSearch(file);
  };

  // 🔥 LOAD PRODUCTS (INALTERADO)
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

  // 🔥 VIDEO (INALTERADO)
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

  const hasResults = visionResults.length > 0;

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

      {/* 🔥 SCAN OVERLAY PROFISSIONAL */}
      {visionLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-2xl text-center relative overflow-hidden">

            {/* scan line effect */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>

            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>

            <p className="text-purple-700 font-semibold text-sm">
              {visionStep === "uploading" && "A enviar imagem..."}
              {visionStep === "scanning" && "Vanessa está a escanear a imagem..."}
              {visionStep === "analyzing" && "A analisar padrões visuais..."}
              {visionStep === "done" && "Pesquisa concluída!"}
            </p>

          </div>
        </div>
      )}

      {/* NAVBAR (INTACTO — NÃO MEXIDO) */}
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
            <button className="px-4 text-purple-600">
              <Search size={20} />
            </button>
          </div>

          <nav className="hidden md:flex gap-3 items-center">

            <button onClick={openCamera} className="px-3 py-2 border border-purple-500 text-purple-600 rounded-xl">
              <Camera size={20} />
            </button>

            <button className="relative px-3 py-2 rounded-xl border border-purple-500 text-purple-600">
              <ShoppingCart size={20} />
            </button>

            <Link href="/login" className="px-3 py-2 bg-purple-600 text-white rounded-xl">
              Entrar
            </Link>

            <Link href="/register" className="px-3 py-2 border border-purple-600 text-purple-600 rounded-xl">
              Cadastrar
            </Link>

          </nav>

          <button className="md:hidden text-3xl text-purple-600" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

        </div>
      </header>

      {/* HERO (INTACTO) */}
      <section>
        <div className="relative h-[420px] md:h-[520px] bg-black mt-4">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dbbqvgvrh/video/upload/v1777753077/a_procura_ce2n1m.mp4" />
          </video>
        </div>
      </section>

      {/* 🔥 VISION RESULTS (SEPARADO E PROFISSIONAL) */}
      {visionMode && (
        <section className="max-w-6xl mx-auto px-4 mt-10">

          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Resultados da Vanessa IA
          </h2>

          {hasResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {visionResults.map((p, i) => (
                <div key={i} className="bg-white shadow rounded-2xl overflow-hidden">

                  <img src={p?.imageUrl} className="h-52 w-full object-cover" />

                  <div className="flex items-center gap-2 px-4 pt-3">
                    <img
                      src={p?.user?.profile?.imageUrl || "/avatar.png"}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {p?.user?.profile?.fullName || "Vendedor"}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-600">{p?.description}</p>
                    <h3 className="font-bold">{p?.title}</h3>
                    <p className="text-purple-600 font-bold">{p?.price} Kz</p>

                    <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-xl">
                      Conversar com vendedor
                    </button>
                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-10 text-gray-600">
              Nenhum produto encontrado com base nesta imagem.
            </div>
          )}

        </section>
      )}

      {/* FEED NORMAL (INTACTO) */}
      {!visionMode && (
        <section className="max-w-6xl mx-auto px-4 mt-10">

          <h3 className="text-lg font-semibold text-purple-700">
            Produtos em destaque
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

            {products.map((p, i) => (
              <div key={i} className="bg-white shadow rounded-2xl overflow-hidden">

                <img src={p?.imageUrl} className="h-52 w-full object-cover" />

                <div className="flex items-center gap-2 px-4 pt-3">
                  <img
                    src={p?.user?.profile?.imageUrl || "/avatar.png"}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">
                    {p?.user?.profile?.fullName}
                  </span>
                </div>

                <div className="px-4 mt-1">
                  <p className="text-sm text-gray-600">{p?.description}</p>
                </div>

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
      )}

    </div>
  );
}