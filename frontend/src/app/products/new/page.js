import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";

export const metadata = {
  title: "Nuevo Producto – ShopCraft",
};

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <ProductForm />
      </main>
    </div>
  );
}
