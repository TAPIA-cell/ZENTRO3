/**
 * @openapi
 * tags:
 *   name: Productos
 *   description: CRUD de productos.
 */

/**
 * @openapi
 * /productos:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener todos los productos.
 *     responses:
 *       200:
 *         description: Lista de productos.
 */

/**
 * @openapi
 * /productos/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200: { description: Producto encontrado }
 *       404: { description: No existe }
 */

/**
 * @openapi
 * /productos:
 *   post:
 *     tags: [Productos]
 *     summary: Crear producto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               precio: { type: number }
 *               descripcion: { type: string }
 *               stock: { type: number }
 *               imagenes:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201: { description: Producto creado }
 */

/**
 * @openapi
 * /productos/{id}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar producto.
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200: { description: Producto actualizado }
 */

/**
 * @openapi
 * /productos/{id}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar producto.
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200: { description: Eliminado }
 */

// backend/routes/productos.js
import { Router } from "express";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";
import db from "../database.js";

const router = Router();

// ============================================================
// 🖼 Normalizar imágenes + convertirlas a URL completa
// ============================================================
function normalizarImagenes(imagenes) {
  if (!imagenes) return [];

  if (Array.isArray(imagenes)) return imagenes;

  try {
    const arr = JSON.parse(imagenes);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function construirUrlImagenes(req, imagenesArray = []) {
  const host = `${req.protocol}://${req.get("host")}`;

  return imagenesArray.map(img => {
    if (!img) return null;

    // Si ya es una URL completa
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // Si empieza con /img/ → no duplicar
    if (img.startsWith("/img/")) {
      return `${host}${img}`;
    }

    // Si solo viene el nombre del archivo
    return `${host}/img/${img}`;
  });
}

// ============================================================
// GET TODOS LOS PRODUCTOS
// ============================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");

    const productos = rows.map((p) => {
      const imgs = normalizarImagenes(p.imagenes);
      return {
        ...p,
        imagenes: construirUrlImagenes(req, imgs)
      };
    });

    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET PRODUCTO POR ID
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM productos WHERE id=?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const producto = rows[0];
    const imgs = normalizarImagenes(producto.imagenes);

    producto.imagenes = construirUrlImagenes(req, imgs);

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// CREAR PRODUCTO
// ============================================================
router.post("/", authRequired, adminOnly, async (req, res) => {
  try {
    let { nombre, precio, descripcion, stock, imagenes } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        error: "Nombre y precio son obligatorios"
      });
    }

    const imagenesArray = normalizarImagenes(imagenes);

    const [result] = await db.query(
      `INSERT INTO productos (nombre, precio, descripcion, stock, imagenes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre,
        precio,
        descripcion ?? "",
        stock ?? 0,
        JSON.stringify(imagenesArray)
      ]
    );

    res.json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error("Error creando producto:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ACTUALIZAR PRODUCTO
// ============================================================
router.put("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, precio, descripcion, stock, imagenes } = req.body;

    const imagenesArray = normalizarImagenes(imagenes);

    await db.query(
      `UPDATE productos 
       SET nombre=?, precio=?, descripcion=?, stock=?, imagenes=?
       WHERE id=?`,
      [
        nombre,
        precio,
        descripcion ?? "",
        stock ?? 0,
        JSON.stringify(imagenesArray),
        id
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Error actualizando producto:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ELIMINAR PRODUCTO
// ============================================================
router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    await db.query("DELETE FROM productos WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando producto:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
