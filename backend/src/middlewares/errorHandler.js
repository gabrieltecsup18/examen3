const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack || err.message}`);

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: "Datos inválidos",
      details: err.details.map((d) => d.message),
    });
  }

  // MySQL errors
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      error: "El recurso ya existe.",
    });
  }

  if (err.code === "ECONNREFUSED") {
    return res.status(503).json({
      success: false,
      error: "No se pudo conectar a la base de datos.",
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || "Error interno del servidor.",
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
