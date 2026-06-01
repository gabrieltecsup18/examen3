const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres.",
    "string.max": "El nombre no puede superar 255 caracteres.",
    "any.required": "El campo 'name' es obligatorio.",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "La descripción no puede superar 2000 caracteres.",
  }),
  price: Joi.number().positive().precision(2).required().messages({
    "number.positive": "El precio debe ser un valor positivo.",
    "any.required": "El campo 'price' es obligatorio.",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.integer": "El stock debe ser un número entero.",
    "number.min": "El stock no puede ser negativo.",
    "any.required": "El campo 'stock' es obligatorio.",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres.",
    "string.max": "El nombre no puede superar 255 caracteres.",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "La descripción no puede superar 2000 caracteres.",
  }),
  price: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "El precio debe ser un valor positivo.",
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    "number.integer": "El stock debe ser un número entero.",
    "number.min": "El stock no puede ser negativo.",
  }),
  image_url: Joi.string().uri().optional().allow("").messages({
    "string.uri": "La URL de la imagen no es válida.",
  }),
}).min(1).messages({
  "object.min": "Debes proporcionar al menos un campo para actualizar.",
});

module.exports = { createProductSchema, updateProductSchema };
