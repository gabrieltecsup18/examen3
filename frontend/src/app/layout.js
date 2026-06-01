import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ShopCraft – Ecommerce",
  description: "Sistema de ecommerce con Express.js, MySQL y Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-cream">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#0f0e0d",
              color: "#faf7f2",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "0",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#e8a020", secondary: "#0f0e0d" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
