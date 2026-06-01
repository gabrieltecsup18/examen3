-- Script de inicialización de la base de datos
-- Ejecutar antes de iniciar el servidor

CREATE DATABASE IF NOT EXISTS ecommerce_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Datos de ejemplo
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Laptop Pro 15"', 'Laptop de alto rendimiento con procesador Intel i9 y 32GB RAM', 1299.99, 15, 'https://picsum.photos/seed/1/400/400'),
('Teclado Mecánico RGB', 'Teclado mecánico con switches Cherry MX Red e iluminación RGB', 89.99, 50, 'https://picsum.photos/seed/2/400/400'),
('Monitor 4K UltraWide', 'Monitor curvo 34 pulgadas resolución 4K con HDR', 549.99, 8, 'https://picsum.photos/seed/3/400/400'),
('Mouse Inalámbrico', 'Mouse ergonómico inalámbrico con batería recargable', 45.00, 100, 'https://picsum.photos/seed/4/400/400'),
('Auriculares Noise Cancelling', 'Auriculares over-ear con cancelación activa de ruido', 199.99, 30, 'https://picsum.photos/seed/5/400/400');
