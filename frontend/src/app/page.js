"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/lib/api";
import { Search, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });

  const fetchProducts = useCallback(async (page = 1, q = "") => {
    setLoading(true);
    try {
      const { data } = await productsApi.getAll({ page, limit: 9, search: q });
      setProducts(data.data);
      setPagination({ ...data.pagination, limit: 9 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1, search);
  }, [search, fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <header className="bg-ink-900 text-cream py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-amber tracking-widest uppercase mb-3">
            Catálogo de Productos
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4 leading-tight">
            Gestión de <em className="text-amber not-italic">Inventario</em>
          </h1>
          <p className="font-body text-ink-300 text-base max-w-md">
            Sistema CRUD completo con Express.js, MySQL y Next.js. Las imágenes se
            obtienen automáticamente desde Lorem Picsum.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-0 mb-8 max-w-md">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar productos..."
            className="input-field flex-1 border-r-0"
          />
          <button
            type="submit"
            className="btn-primary px-4 py-3 flex items-center gap-1"
          >
            <Search size={16} />
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSearchInput(""); }}
              className="btn-secondary px-4 py-3 text-xs"
            >
              Limpiar
            </button>
          )}
        </form>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted font-body">
            {loading ? (
              "Cargando..."
            ) : (
              <>
                <span className="font-medium text-ink-900">{pagination.total}</span>{" "}
                producto{pagination.total !== 1 ? "s" : ""} encontrado{pagination.total !== 1 ? "s" : ""}
                {search && <span> para "<strong>{search}</strong>"</span>}
              </>
            )}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-muted">
            <Loader2 size={22} className="animate-spin" />
            <span className="font-body text-sm">Cargando productos...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Package size={40} className="mx-auto text-ink-200 mb-4" />
            <p className="font-display text-xl text-ink-400">No hay productos</p>
            <p className="text-sm text-muted mt-2 font-body">
              {search ? "Intenta con otro término de búsqueda." : "Comienza creando tu primer producto."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                className="animate-fade-up"
              >
                <ProductCard product={product} onDeleted={handleDeleted} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => fetchProducts(pagination.page - 1, search)}
              disabled={pagination.page === 1}
              className="btn-secondary px-3 py-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-sm text-muted">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchProducts(pagination.page + 1, search)}
              disabled={pagination.page === pagination.totalPages}
              className="btn-secondary px-3 py-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-ink-100 py-6 text-center text-xs text-muted font-mono">
        ShopCraft Ecommerce © {new Date().getFullYear()} — Express.js + MySQL + Next.js
      </footer>
    </div>
  );
}
