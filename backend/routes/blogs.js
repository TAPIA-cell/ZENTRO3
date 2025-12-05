/**
 * @openapi
 * tags:
 *   name: Blogs
 *   description: Gestión de blogs.
 */

/**
 * @openapi
 * /blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Obtener todos los blogs.
 *     responses:
 *       200: { description: Lista obtenida }
 */

/**
 * @openapi
 * /blogs/{id}:
 *   get:
 *     tags: [Blogs]
 *     summary: Obtener un blog por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200: { description: Blog encontrado }
 *       404: { description: No existe }
 */

/**
 * @openapi
 * /blogs:
 *   post:
 *     tags: [Blogs]
 *     summary: Crear blog.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               contenido: { type: string }
 *               imagen: { type: string }
 *     responses:
 *       201: { description: Blog creado }
 */

/**
 * @openapi
 * /blogs/{id}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Eliminar blog.
 */


import express from "express";
import db from "../database.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
// =====================
// Normaliza lo que viene desde el front o BD
// =====================
function normalizarImagen(imagen) {
  if (!imagen) return null;

  // URL completa (https/http)
  if (/^https?:\/\//i.test(imagen)) return imagen;

  // Limpia errores antiguos "/img/img/"
  imagen = imagen.replace(/^\/?img\//, "");

  // Si ya empieza por "/img/"
  if (imagen.startsWith("/img/")) return imagen;

  // Solo la dejamos como /img/archivo.webp
  return `/img/${imagen}`;
}

// =====================
// Construye URL final absoluta
// =====================
function resolverUrl(req, imagen) {
  if (!imagen) return null;

  // URL externa se respeta
  if (/^https?:\/\//i.test(imagen)) return imagen;

  const host = `${req.protocol}://${req.get("host")}`;

  // Limpia /img/ duplicados
  const file = imagen.replace(/^\/?img\//, "");

  return `${host}/img/${file}`;
}


// =====================
// GET ALL
// =====================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM blogs ORDER BY fecha DESC"
    );

    const blogs = rows.map((b) => ({
      ...b,
      imagen: resolverUrl(req, normalizarImagen(b.imagen)),
    }));

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// GET ONE
// =====================
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM blogs WHERE id=?",
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "No encontrado" });

    const blog = rows[0];
    blog.imagen = resolverUrl(req, normalizarImagen(blog.imagen));

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// POST
// =====================
router.post("/", authRequired, adminOnly, async (req, res) => {
  try {
    let { titulo, autor, fecha, imagen, contenido } = req.body;
    imagen = normalizarImagen(imagen);

    const [result] = await db.query(
      "INSERT INTO blogs (titulo, autor, fecha, imagen, contenido) VALUES (?, ?, ?, ?, ?)",
      [titulo, autor, fecha, imagen, contenido]
    );

    res.json({ ok: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// PUT
// =====================
router.put("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    let { titulo, autor, fecha, imagen, contenido } = req.body;
    imagen = normalizarImagen(imagen);

    await db.query(
      `UPDATE blogs SET titulo=?, autor=?, fecha=?, imagen=?, contenido=? WHERE id=?`,
      [titulo, autor, fecha, imagen, contenido, req.params.id]
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// DELETE
// =====================
router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    await db.query("DELETE FROM blogs WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
