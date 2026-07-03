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
  const [isVisionMode, setIsVisionMode] = useState(false);

  const [videoReady, setVideoReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [visionLoading, setVisionLoading] = useState(false);
  const [visionStep, setVisionStep] = useState("idle");

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

  // 🔥 FIXED VISION AI FLOW
  const handleImageSearch = async (file: File) => {
    try {
      setVisionLoading(true);
      setVisionStep("uploading");
      setIsVisionMode(true);

      const formData = new FormData();
      formData.append("image", file);

      setTimeout(() => setVisionStep("analyzing"), 600);

      const res = await fetch(`${API_URL}/vision/search`, {
        method: "POST",
        body: formData,
      });

      setVisionStep("matching");

      const data = await res.json();

      const results = Array.isArray(data?.products)
        ? data.products
        : [];

      setVisionResults(results);

      setVisionStep("done");

      setTimeout(() => {
        setVisionLoading(false);
        setVisionStep("idle");
      }, 800);

    } catch (err) {
      console.error("Vision error:", err);
      setVisionResults([]);
      setVisionLoading(false);
      setVisionStep("idle");
      setIsVisionMode(false);
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

  return (
    <div className="min-h-screen bg-white">

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* 🔥 VANESSA AI OVERLAY */}
      {visionLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-2xl text-center shadow-xl">

            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>

            <p className="text-purple-700 font-semibold text-sm">
              {visionStep === "uploading" && "Vanessa está a receber a imagem..."}
              {visionStep === "analyzing" && "Vanessa está a analisar padrões visuais..."}
              {visionStep === "matching" && "A procurar produtos semelhantes..."}
              {visionStep === "done" && "Análise concluída!"}
            </p>

          </div>
        </div>
      )}

      {/* NAVBAR (mantido igual) */}
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

      {/* HERO (mantido) */}
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

      {/* 🔥 RESULTADOS IA */}
      {isVisionMode && visionResults.length > 0 ? (
        <section className="max-w-6xl mx-auto px-4 mt-10">
          <h3 className="text-xl font-bold text-purple-700">
            Resultados da Vanessa IA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

            {visionResults.map((p, i) => (
              <div key={i} className="bg-white shadow rounded-2xl overflow-hidden">

                <img src={p?.imageUrl} className="h-52 w-full object-cover" />

                <div className="p-4">
                  <h4 className="font-semibold">{p?.title}</h4>
                  <p className="text-purple-600 font-bold">{p?.price} Kz</p>
                </div>

              </div>
            ))}

          </div>
        </section>
      ) : (
        <>
          {/* FEED NORMAL */}
          <section className="max-w-6xl mx-auto px-4 mt-10">
            <h3 className="text-lg font-semibold text-purple-700">
              Produtos em destaque
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

              {products.map((p, i) => (
                <div key={i} className="bg-white shadow rounded-2xl overflow-hidden">

                  <img src={p?.imageUrl} className="h-52 w-full object-cover" />

                  <div className="p-4">
                    <h4 className="font-semibold">{p?.title}</h4>
                    <p className="text-purple-600 font-bold">{p?.price} Kz</p>
                  </div>

                </div>
              ))}

            </div>
          </section>
        </>
      )}

    </div>
  );
}