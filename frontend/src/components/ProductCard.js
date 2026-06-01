"use client";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Package } from "lucide-react";
import { productsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProductCard({ product, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    try {
      await productsApi.delete(product.id);
      toast.success("Producto eliminado");
      onDeleted?.(product.id);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const imageUrl = product.image_url || `https://picsum.photos/seed/${product.id}/400/400`;

  return (
    <article className="card group flex flex-col overflow-hidden animate-fade-up">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-ink-50">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${product.id + 10}/400/400`;
          }}
        />
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-mono px-2 py-1 font-medium ${
              product.stock > 0
                ? "bg-sage text-white"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-display text-lg text-ink-900 leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted font-body mt-1 line-clamp-2 min-h-[2.5rem]">
            {product.description || "Sin descripción"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-100">
          <span className="font-display text-2xl text-ink-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="p-2 border border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900 transition-colors duration-150"
              title="Editar"
            >
              <Pencil size={15} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 border border-red-200 text-red-500 hover:border-red-600 hover:text-red-600 transition-colors duration-150"
              title="Eliminar"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
