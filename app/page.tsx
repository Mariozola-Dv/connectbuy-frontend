"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Search } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

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

  // 🔥 tentativa de forçar autoplay em alguns browsers
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const playVideo = async () => {
      try {
        await v.play();
      } catch (err) {
        console.log("Autoplay bloqueado:", err);
      }
    };

    playVideo();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR (inalterado) */}
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
            <button className="px-3 py-2 rounded-xl border border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white transition flex items-center justify-center shadow-sm hover:shadow-md">
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
      </header>

      {/* HERO - VÍDEO ROBUSTO (CORRIGIDO) */}
      <section className="pt-20">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden bg-black">

          {!videoError ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onError={() => setVideoError(true)}
            >
              <source
                src="https://res.cloudinary.com/dbbqvgvrh/video/upload/v1777753077/a_procura_ce2n1m.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            // 🔥 fallback caso vídeo não carregue no dispositivo
            <img
              src="https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1600&q=60"
              className="w-full h-full object-cover"
            />
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

      {/* FEED (INALTERADO) */}
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

                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-full shadow">

                  <img
                    src={p?.user?.profile?.imageUrl || "https://ui-avatars.com/api/?name=User"}
                    className="w-6 h-6 rounded-full object-cover"
                  />

                  <span className="text-xs font-medium">
                    {p?.user?.profile?.fullName || "Vendedor"}
                  </span>

                </div>
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