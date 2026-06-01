"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { productsApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function ProductForm({ product = null }) {
  const isEditing = !!product;
  const router = useRouter();

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock ?? "",
    image_url: product?.image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = "Ingresa un precio válido mayor a 0.";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0)
      errs.stock = "El stock debe ser 0 o más.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        ...(isEditing && form.image_url ? { image_url: form.image_url } : {}),
      };

      if (isEditing) {
        await productsApi.update(product.id, payload);
        toast.success("Producto actualizado");
      } else {
        await productsApi.create(payload);
        toast.success("Producto creado — imagen asignada automáticamente");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink-900 transition-colors mb-8 font-body"
      >
        <ArrowLeft size={15} />
        Volver al catálogo
      </Link>

      <h1 className="font-display text-3xl text-ink-900 mb-2">
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
      </h1>
      <p className="text-sm text-muted font-body mb-8">
        {isEditing
          ? "Modifica los campos que desees actualizar."
          : "Completa el formulario. La imagen se asignará automáticamente desde Lorem Picsum."}
      </p>

      {!isEditing && (
        <div className="flex items-start gap-3 bg-amber/10 border border-amber/30 px-4 py-3 mb-6">
          <ImageIcon size={16} className="text-amber mt-0.5 shrink-0" />
          <p className="text-xs text-ink-700 font-body leading-relaxed">
            Al crear el producto, se obtendrá automáticamente una imagen aleatoria desde{" "}
            <strong>Lorem Picsum</strong> y se almacenará en la base de datos.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-1.5">
            Nombre *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Laptop Pro 15"
            className={`input-field ${errors.name ? "border-red-400" : ""}`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-1.5">
            Descripción
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción detallada del producto..."
            className="input-field resize-none"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-1.5">
              Precio (USD) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className={`input-field ${errors.price ? "border-red-400" : ""}`}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-1.5">
              Stock *
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className={`input-field ${errors.stock ? "border-red-400" : ""}`}
            />
            {errors.stock && (
              <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Image URL (edit only) */}
        {isEditing && (
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-1.5">
              URL Imagen
            </label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="input-field"
            />
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading
              ? isEditing
                ? "Actualizando..."
                : "Creando..."
              : isEditing
              ? "Guardar Cambios"
              : "Crear Producto"}
          </button>
          <Link href="/" className="btn-secondary flex items-center">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
