"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Search } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [videoFailed, setVideoFailed] = useState(false);

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

  // 🔥 FIX AUTOPLAY REAL MOBILE
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        setVideoFailed(true);
      }
    };

    tryPlay();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-purple-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-3">

          <h1 className="text-xl font-bold shrink-0">
            <span className="text-blue-600">Connect</span>
            <span className="text-purple-600">Buy</span>
          </h1>

          {/* SEARCH */}
          <div className="flex-1 hidden md:flex items-center border border-purple-400 rounded-xl overflow-hidden bg-white">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar produto..."
              className="w-full px-4 py-2 outline-none"
            />
            <button className="px-4 text-purple-600">
              <Search size={20} />
            </button>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex gap-3 items-center">
            <button className="px-3 py-2 rounded-xl border border-purple-500 text-purple-600">
              <Camera size={20} />
            </button>

            <Link href="/login" className="px-3 py-2 rounded-xl bg-purple-600 text-white">
              Entrar
            </Link>

            <Link href="/register" className="px-3 py-2 rounded-xl border border-purple-600 text-purple-600">
              Cadastrar
            </Link>
          </nav>

          {/* HAMBURGER FIX */}
          <button
            className="md:hidden text-3xl text-purple-600"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU (FIX REAL) */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMenuOpen(false)}>

            <div
              className="absolute top-0 right-0 w-72 h-full bg-white p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="text-2xl mb-6"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full p-2 border rounded-xl mb-4"
              />

              <div className="flex flex-col gap-3">

                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="bg-purple-600 text-white p-3 rounded-xl text-center">
                  Entrar
                </Link>

                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="border border-purple-600 text-purple-600 p-3 rounded-xl text-center">
                  Cadastrar
                </Link>

              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO VIDEO FIX */}
      <section className="pt-20">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden bg-black">

          {!videoFailed ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              onError={() => setVideoFailed(true)}
            >
              <source
                src="https://res.cloudinary.com/dbbqvgvrh/video/upload/v1777753077/a_procura_ce2n1m.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              A carregar vídeo...
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Compra. Vende. Conecta.
            </h2>
          </div>

        </div>
      </section>

      {/* FEED (INTACTO) */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {products.map((p, index) => (
            <div key={p?.id || index} className="bg-white rounded-2xl shadow">

              <img
                src={p?.imageUrl || "/placeholder.png"}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">
                <h4 className="font-semibold">{p?.title}</h4>
                <p className="text-purple-600 font-bold">{p?.price} Kz</p>
              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}