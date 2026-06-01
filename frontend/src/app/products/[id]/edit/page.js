"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { productsApi } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productsApi.getById(id);
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center gap-3 text-muted py-20 justify-center">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-body text-sm">Cargando producto...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-red-600 py-20 justify-center">
            <AlertCircle size={20} />
            <span className="font-body text-sm">{error}</span>
          </div>
        ) : (
          <ProductForm product={product} />
        )}
      </main>
    </div>
  );
}
