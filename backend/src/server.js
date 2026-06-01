require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { initDB } = require("./config/database");
const productRoutes = require("./routes/product.routes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middlewares Globales ───────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logging: 'dev' en desarrollo, 'combined' en producción
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🛒 Ecommerce API funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      health: "/health",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── Rutas API ──────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);

// ─── Manejo de Errores ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Iniciar Servidor ───────────────────────────────────────────────────────
const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📦 Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`🗄️  Base de datos: ${process.env.DB_NAME || "ecommerce_db"}\n`);
  });
};

startServer();

module.exports = app;
