const axios = require("axios");
const { pool } = require("../config/database");

// Fetch a random image from Lorem Picsum
const fetchExternalImage = async () => {
  try {
    // Use a random seed so each product gets a unique image
    const seed = Math.floor(Math.random() * 1000);
    const width = 400;
    const height = 400;
    // Picsum redirects to actual image URL; we capture the final URL
    const response = await axios.get(
      `https://picsum.photos/seed/${seed}/${width}/${height}`,
      { maxRedirects: 5 }
    );
    return response.request.res.responseUrl || `https://picsum.photos/seed/${seed}/${width}/${height}`;
  } catch {
    // Fallback: direct deterministic URL
    const seed = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${seed}/400/400`;
  }
};

// GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = "SELECT * FROM products";
    let countQuery = "SELECT COUNT(*) as total FROM products";
    const params = [];
    const countParams = [];

    if (search) {
      query += " WHERE name LIKE ? OR description LIKE ?";
      countQuery += " WHERE name LIKE ? OR description LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Producto con ID ${id} no encontrado.`,
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description = "", price, stock } = req.body;

    // Fetch image from external API automatically
    const image_url = await fetchExternalImage();

    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, image_url]
    );

    const [newProduct] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente.",
      data: newProduct[0],
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check existence
    const [existing] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Producto con ID ${id} no encontrado.`,
      });
    }

    const fields = req.body;
    const setClauses = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(fields), id];

    await pool.query(
      `UPDATE products SET ${setClauses} WHERE id = ?`,
      values
    );

    const [updated] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Producto actualizado exitosamente.",
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Producto con ID ${id} no encontrado.`,
      });
    }

    await pool.query("DELETE FROM products WHERE id = ?", [id]);

    res.json({
      success: true,
      message: `Producto con ID ${id} eliminado exitosamente.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
