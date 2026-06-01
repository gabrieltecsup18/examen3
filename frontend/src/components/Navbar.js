"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-ink-900 text-cream sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <ShoppingBag size={22} className="text-amber" />
          <span className="font-display text-xl tracking-tight">ShopCraft</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-body font-medium">
          <Link
            href="/"
            className="text-ink-200 hover:text-amber transition-colors duration-200"
          >
            Productos
          </Link>
          <Link
            href="/products/new"
            className="bg-amber text-ink-900 px-4 py-2 hover:bg-amber-light transition-colors duration-200 font-medium"
          >
            + Nuevo
          </Link>
        </div>
      </div>
    </nav>
  );
}
