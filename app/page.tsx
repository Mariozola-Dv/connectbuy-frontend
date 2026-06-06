"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Search } from "lucide-react";

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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        const list =
          Array.isArray(data)
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
        setVideoReady(true);
      } catch (err) {
        setVideoReady(false);
      }
    };

    const timer = setTimeout(() => {
      tryPlay();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // ✅ ABRIR CÂMERA / GALERIA
  const openCamera = () => {
    imageInputRef.current?.click();
  };

  // ✅ QUANDO ESCOLHE IMAGEM
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Imagem selecionada:", file);

    // aqui depois vamos ligar IA + busca de produtos
  };

  return (
    <div className="min-h-screen bg-white">

      {/* INPUT INVISÍVEL DA CÂMERA */}
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

          <h1 className="text-xl font-bold shrink-0">
            <span className="text-blue-600">Connect</span>
            <span className="text-purple-600">Buy</span>
          </h1>

          <div className="flex-1 hidden md:flex items-center border border-purple-400 rounded-xl overflow-hidden bg-white">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar produto (ex: iPhone, camisa, Nike...)"
              className="w-full px-4 py-2 outline-none"
            />

            <button className="px-4 h-full border-l border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white transition flex items-center justify-center">
              <Search size={20} strokeWidth={2.2} />
            </button>

          </div>

          <nav className="hidden md:flex gap-3 text-sm items-center">

            {/* CAMERA DESKTOP */}
            <button
              onClick={openCamera}
              className="px-3 py-2 rounded-xl border border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white transition flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <Camera size={20} strokeWidth={2.2} />
            </button>

            <Link href="/login" className="px-3 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition">
              Entrar
            </Link>

            <Link href="/register" className="px-3 py-2 rounded-xl border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition">
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

        {/* MENU MOBILE */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-purple-200 px-4 pb-4 shadow-lg">

            <div className="mt-4 flex items-center border border-purple-400 rounded-xl overflow-hidden bg-white">

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar produto..."
                className="w-full px-4 py-2 outline-none"
              />

              <button className="px-4 h-full border-l border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white transition flex items-center justify-center">
                <Search size={20} strokeWidth={2.2} />
              </button>

            </div>

            <div className="flex flex-col gap-3 mt-4">

              {/* CAMERA MOBILE */}
              <button
                onClick={openCamera}
                className="w-full py-3 rounded-xl border border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white transition flex items-center justify-center gap-2"
              >
                <Camera size={20} strokeWidth={2.2} />
                <span>Pesquisar por imagem</span>
              </button>

              <Link href="/login" className="w-full text-center py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition">
                Entrar
              </Link>

              <Link href="/register" className="w-full text-center py-3 rounded-xl border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition">
                Cadastrar
              </Link>

            </div>

          </div>
        )}

      </header>

      {/* HERO */}
      <section className="pt-20">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden bg-black">

          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={() => setVideoReady(true)}
          >
            <source
              src="https://res.cloudinary.com/dbbqvgvrh/video/upload/v1777753077/a_procura_ce2n1m.mp4"
              type="video/mp4"
            />
          </video>

          {!videoReady && (
            <div className="absolute inset-0 bg-black flex items-center justify-center text-white">
              A carregar vídeo...
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">

            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Compra. Vende. Conecta.
            </h2>

            <p className="text-white/80 mt-3 max-w-xl text-sm md:text-base">
              Pesquisa por texto ou imagem para conectar compradores e vendedores.
            </p>

          </div>

        </div>
      </section>

      {/* FEED */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <h3 className="text-lg font-semibold text-purple-700 border-l-4 border-purple-500 pl-2">
          Produtos em destaque
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {products.map((p, index) => (
            <div
              key={p?.id || index}
              className="bg-white rounded-2xl shadow hover:shadow-2xl transition transform hover:scale-[1.02] overflow-hidden"
            >

              <div className="relative h-52 overflow-hidden">

                <img
                  src={p?.imageUrl || "/placeholder.png"}
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="p-4">

                <h4 className="font-semibold line-clamp-1">
                  {p?.title || "Produto sem nome"}
                </h4>

                <p className="text-purple-600 font-bold mt-1">
                  {p?.price || 0} Kz
                </p>

                <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition">
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