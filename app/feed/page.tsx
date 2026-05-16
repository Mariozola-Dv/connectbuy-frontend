"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  userId?: string;
};

export default function Feed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();

        console.log("FEED DATA:", data);

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">🔥 Feed ConnectBuy</h1>

        <Link href="/dashboard" className="text-white bg-purple-600 px-4 py-2 rounded-xl">
          Voltar
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden border"
          >
            <img src={item.imageUrl} className="h-48 w-full object-cover" />

            <div className="p-4">
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-blue-600 font-bold">{item.price} Kz</p>
            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
}