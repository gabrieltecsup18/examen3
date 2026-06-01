# 🛒 ShopCraft — Ecommerce con Express.js, MySQL y Next.js

Sistema de ecommerce full-stack con CRUD de productos, consumo de API externa para imágenes automáticas, validación de datos y despliegue en la nube.

---

## 📐 Arquitectura

```
ecommerce/
├── backend/          # API RESTful Express.js
│   ├── src/
│   │   ├── config/       # Conexión MySQL (pool)
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middlewares/  # Validación, errores, logging
│   │   ├── routes/       # Endpoints REST
│   │   ├── validators/   # Esquemas Joi
│   │   └── server.js     # Entry point
│   ├── database.sql  # Script de inicialización
│   └── .env.example
│
└── frontend/         # UI Next.js 14 (App Router)
    └── src/
        ├── app/          # Páginas (Home, New, Edit)
        ├── components/   # Navbar, ProductCard, ProductForm
        └── lib/          # Cliente Axios
```

---

## ✅ Requisitos cumplidos

| Requisito | Estado |
|---|---|
| API RESTful con Express.js | ✅ |
| CRUD completo de productos | ✅ |
| Base de datos MySQL con tabla `products` | ✅ |
| Consumo de API externa (Lorem Picsum) | ✅ |
| Validación con Joi | ✅ |
| Middleware de logging (Morgan) | ✅ |
| Manejo de errores centralizado | ✅ |
| Frontend Next.js | ✅ |
| Paginación y búsqueda | ✅ |
| Despliegue en línea | ✅ |

---

## 🚀 Instalación Local

### Prerrequisitos
- Node.js ≥ 18
- MySQL 8.x corriendo localmente

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/ecommerce-express-mysql.git
cd ecommerce-express-mysql
```

### 2. Configurar la Base de Datos
```bash
mysql -u root -p < backend/database.sql
```

### 3. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales MySQL
npm install
npm run dev
```

El servidor queda en `http://localhost:4000`

Variables de entorno del backend (`.env`):
```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ecommerce_db
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env.local
# Edita .env.local si tu backend corre en otro puerto
npm install
npm run dev
```

La UI queda en `http://localhost:3000`

Variables de entorno del frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🌐 URL del Proyecto en Línea

| Servicio | URL |
|---|---|
| **Frontend (Vercel)** | `https://shopcraft-ecommerce.vercel.app` |
| **Backend API (Render)** | `https://shopcraft-api.onrender.com` |

> **Nota:** El backend en Render (free tier) puede tardar ~30 segundos en responder si estuvo inactivo.

---

## 📡 Endpoints de la API

**Base URL:** `https://shopcraft-api.onrender.com/api`

### GET /api/products
Listar todos los productos con paginación y búsqueda opcional.

**Parámetros de query:**
| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | number | 1 | Página actual |
| `limit` | number | 10 | Resultados por página |
| `search` | string | "" | Buscar en nombre o descripción |

**Ejemplo:**
```bash
curl https://shopcraft-api.onrender.com/api/products?page=1&limit=5&search=laptop
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop Pro 15\"",
      "description": "Laptop de alto rendimiento...",
      "price": "1299.99",
      "stock": 15,
      "image_url": "https://picsum.photos/seed/742/400/400",
      "created_at": "2024-06-01T12:00:00.000Z",
      "updated_at": "2024-06-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  }
}
```

---

### GET /api/products/:id
Obtener un producto por ID.

```bash
curl https://shopcraft-api.onrender.com/api/products/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro 15\"",
    "description": "Laptop de alto rendimiento...",
    "price": "1299.99",
    "stock": 15,
    "image_url": "https://picsum.photos/seed/742/400/400",
    "created_at": "2024-06-01T12:00:00.000Z",
    "updated_at": "2024-06-01T12:00:00.000Z"
  }
}
```

---

### POST /api/products
Crear un nuevo producto. **La imagen se obtiene automáticamente de Lorem Picsum.**

```bash
curl -X POST https://shopcraft-api.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Auriculares Sony WH-1000XM5",
    "description": "Auriculares inalámbricos con cancelación activa de ruido premium",
    "price": 349.99,
    "stock": 25
  }'
```

**Respuesta 201:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente.",
  "data": {
    "id": 6,
    "name": "Auriculares Sony WH-1000XM5",
    "description": "Auriculares inalámbricos con cancelación activa de ruido premium",
    "price": "349.99",
    "stock": 25,
    "image_url": "https://picsum.photos/seed/317/400/400",
    "created_at": "2024-06-01T15:30:00.000Z",
    "updated_at": "2024-06-01T15:30:00.000Z"
  }
}
```

**Validaciones (400 si falla):**
```json
{
  "success": false,
  "error": "Datos inválidos",
  "details": [
    "El campo 'name' es obligatorio.",
    "El precio debe ser un valor positivo."
  ]
}
```

---

### PUT /api/products/:id
Actualizar un producto (campos parciales).

```bash
curl -X PUT https://shopcraft-api.onrender.com/api/products/6 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 299.99,
    "stock": 30
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente.",
  "data": {
    "id": 6,
    "name": "Auriculares Sony WH-1000XM5",
    "price": "299.99",
    "stock": 30,
    ...
  }
}
```

---

### DELETE /api/products/:id
Eliminar un producto.

```bash
curl -X DELETE https://shopcraft-api.onrender.com/api/products/6
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto con ID 6 eliminado exitosamente."
}
```

---

## 🗄️ Esquema de Base de Datos

```sql
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)    NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2)  NOT NULL,
  stock       INT             NOT NULL DEFAULT 0,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🖼️ API Externa — Lorem Picsum

Al hacer `POST /api/products`, el backend llama automáticamente a:

```
https://picsum.photos/seed/{random}/400/400
```

Esto retorna una imagen aleatoria única para cada producto. La URL final se almacena en el campo `image_url`.

---

## 🚢 Guía de Despliegue

### Backend → Render

1. Crea una cuenta en [render.com](https://render.com)
2. New → Web Service → conecta tu repo de GitHub
3. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
4. Agrega las variables de entorno (panel de Render → Environment)
5. Para MySQL usa [PlanetScale](https://planetscale.com) o [Railway](https://railway.app) (tier gratuito)

### Frontend → Vercel

1. Importa tu repo en [vercel.com](https://vercel.com)
2. Configura:
   - **Root Directory:** `frontend`
   - **Framework:** Next.js
3. Agrega la variable: `NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api`

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Express.js 4 |
| Base de datos | MySQL 8 + mysql2 |
| Validación | Joi |
| Logging | Morgan |
| Frontend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| HTTP Client | Axios |
| API Externa | Lorem Picsum |
| Deploy Backend | Render |
| Deploy Frontend | Vercel |

---

## 👨‍💻 Autor

Desarrollado como proyecto académico de Ecommerce con Express.js y Next.js.
