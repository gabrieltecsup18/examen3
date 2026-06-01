const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

// GET /api/products?page=1&limit=10&search=palabra
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products
router.post("/", validate(createProductSchema), createProduct);

// PUT /api/products/:id
router.put("/:id", validate(updateProductSchema), updateProduct);

// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

module.exports = router;
