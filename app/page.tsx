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
  Image as GalleryIcon,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [videoReady, setVideoReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ESTADOS PARA O SELETOR DE IMAGEM E IA
  const [showPicker, setShowPicker] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionStep, setVisionStep] = useState("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  // FUNÇÃO DE BUSCA IA INTEGRADA
  const handleImageSearch = async (file: File) => {
    setShowPicker(false);
    setVisionLoading(true);
    setVisionStep("uploading");

    try {
      const formData = new FormData();
      formData.append("image", file);

      setVisionStep("analyzing");
      const res = await fetch(`${API_URL}/vision/search`, {
        method: "POST",
        body: formData,
      });

      setVisionStep("matching");
      const data = await res.json();
      
      // Atualiza os produtos com os resultados da Vanessa
      setProducts(Array.isArray(data?.products) ? data.products : []);
      
      setVisionStep("done");
      setTimeout(() => {
        setVisionLoading(false);
        setVisionStep("idle");
      }, 600);
    } catch (err) {
      console.error("Vision error:", err);
      setProducts([]);
      setVisionLoading(false);
      setVisionStep("idle");
    }
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
      {/* INPUTS DE ARQUIVO */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && handleImageSearch(e.target.files[0])} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageSearch(e.target.files[0])} className="hidden" />

      {/* MODAL DE SELEÇÃO DE ORIGEM */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-xl font-bold mb-6 text-black">Escolher Imagem</h2>
            <div className="flex gap-4">
              <button onClick={() => cameraInputRef.current?.click()} className="flex-1 py-4 border border-purple-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-50">
                <Camera size={30} className="text-purple-600" />
                <span className="text-sm font-semibold">Câmera</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex-1 py-4 border border-purple-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-50">
                <GalleryIcon size={30} className="text-purple-600" />
                <span className="text-sm font-semibold">Galeria</span>
              </button>
            </div>
            <button onClick={() => setShowPicker(false)} className="mt-6 w-full py-3 text-gray-500 font-medium">Cancelar</button>
          </div>
        </div>
      )}

      {/* OVERLAY DE PROCESSAMENTO IA */}
      {visionLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110]">
          <div className="bg-white w-72 p-8 rounded-3xl text-center shadow-2xl">
            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-purple-700 font-bold text-sm">
              {visionStep === "uploading" && "A carregar imagem..."}
              {visionStep === "analyzing" && "Vanessa está a analisar a imagem..."}
              {visionStep === "matching" && "A procurar produtos na base de dados..."}
              {visionStep === "done" && "Resultados encontrados com sucesso!"}
            </p>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-purple-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold"><span className="text-blue-600">Connect</span><span className="text-purple-600">Buy</span></h1>
          <div className="flex-1 hidden md:flex items-center border border-purple-400 rounded-xl overflow-hidden bg-white mx-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar produto..." className="w-full px-4 py-2 outline-none text-black" />
            <button className="px-4 text-purple-600"><Search size={20} /></button>
          </div>
          <nav className="hidden md:flex gap-3 items-center">
            <button onClick={() => setShowPicker(true)} className="px-3 py-2 border border-purple-500 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition"><Camera size={20} /></button>
            <button className="relative px-3 py-2 border border-purple-500 text-purple-600 rounded-xl"><ShoppingCart size={20} />{cartCount > 0 && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 rounded-full">{cartCount}</span>}</button>
            <Link href="/login" className="px-3 py-2 bg-purple-600 text-white rounded-xl">Entrar</Link>
          </nav>
          <button className="md:hidden text-3xl text-purple-600" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </header>

      {/* ESTRUTURA ORIGINAL MANTIDA */}
      <div className="pt-24 flex justify-center"><div className="flex items-center gap-3 w-full max-w-xl px-4 py-2 rounded-full bg-purple-50 border border-purple-200"><span className="h-2 w-2 bg-purple-600 rounded-full animate-ping"></span><span className="text-sm font-semibold text-purple-700">Live Marketplace • Online</span></div></div>
      
      <section className="relative h-[420px] bg-black mt-4"><video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover" src="https://res.cloudinary.com/dbbqvgvrh/video/upload/v1777753077/a_procura_ce2n1m.mp4" /></section>
      
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <h3 className="text-xl font-bold text-black mb-6">Categorias</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categories.map((cat, i) => { const Icon = cat.icon; return (
            <button key={i} className="group bg-white border border-purple-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-600"><Icon className="text-purple-700 group-hover:text-white" /></div>
              <span className="text-sm font-semibold">{cat.name}</span>
            </button>
          )})}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-10">
        <h3 className="text-lg font-semibold text-purple-700 border-l-4 border-purple-500 pl-2">Produtos em destaque</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {products.map((p, i) => (
            <div key={i} className="bg-white shadow rounded-2xl overflow-hidden">
              <img src={p?.imageUrl || "/placeholder.png"} className="h-52 w-full object-cover" />
              <div className="p-4"><h4 className="font-semibold">{p?.title}</h4><p className="text-purple-600 font-bold">{p?.price} Kz</p><button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-xl">Conversar com vendedor</button></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}