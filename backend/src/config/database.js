const mysql2 = require("mysql2/promise");
require("dotenv").config();

const pool = mysql2.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || parseInt(process.env.MYSQLPORT) || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || "ecommerce_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const initDB = async () => {
  try {
    const conn = await pool.getConnection();

    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    conn.release();
    console.log("✅ Conexión a MySQL establecida y tabla verificada.");
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = { pool, initDB };
