/**
 * @openapi
 * tags:
 *   name: Ventas
 *   description: Registro de compras.
 */

/**
 * @openapi
 * /ventas:
 *   get:
 *     tags: [Ventas]
 *     summary: Obtener todas las ventas (admin).
 */

/**
 * @openapi
 * /ventas:
 *   post:
 *     tags: [Ventas]
 *     summary: Registrar una venta.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario: { type: number }
 *               total: { type: number }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_producto: { type: number }
 *                     cantidad: { type: number }
 *                     subtotal: { type: number }
 *     responses:
 *       201: { description: Venta registrada }
 */


import express from "express";
import db from "../database.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   HELPERS
====================================================== */
const generateToken = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Normaliza imágenes y asegura que siempre haya 1 imagen válida
const procesarImagenes = (items) => {
  return items.map((item) => {
    let img = "/img/placeholder.jpg";

    try {
      let arr =
        typeof item.imagenes === "string"
          ? JSON.parse(item.imagenes)
          : item.imagenes;

      if (Array.isArray(arr) && arr.length > 0) {
        img = arr[0];
      }
    } catch (err) {
      console.log("Error parseando imágenes:", err.message);
    }

    return {
      ...item,
      imagen: img,
    };
  });
};

/* ======================================================
   GET: VENTA POR TOKEN DE SEGUIMIENTO (QR)
====================================================== */
router.get("/track/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const [venta] = await db.query(
      `
      SELECT v.*, u.nombre AS usuario_nombre, u.email AS usuario_correo
      FROM ventas v
      LEFT JOIN usuarios u ON u.id = v.id_usuario
      WHERE v.token = ?
    `,
      [token]
    );

    if (venta.length === 0)
      return res.status(404).json({ error: "Orden no válida" });

    const [items] = await db.query(
      `
      SELECT p.nombre, p.imagenes, d.cantidad, d.subtotal, p.precio
      FROM ventas_detalle d
      JOIN productos p ON p.id = d.id_producto
      WHERE d.id_venta = ?
    `,
      [venta[0].id]
    );

    res.json({
      id: venta[0].id,
      fecha: venta[0].fecha,
      total: venta[0].total,
      usuario: venta[0].usuario_nombre || "Cliente Anónimo",
      correo: venta[0].usuario_correo || "Sin correo",
      items: procesarImagenes(items),
    });
  } catch (err) {
    console.error("Error al rastrear orden:", err);
    res.status(500).json({ error: "Error al rastrear orden" });
  }
});

/* ======================================================
   GET: TODAS LAS VENTAS (ADMIN)
====================================================== */
router.get("/", authRequired, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        v.id,
        v.id_usuario,
        u.nombre AS usuario,
        u.email AS correo,
        v.total,
        v.fecha
      FROM ventas v
      LEFT JOIN usuarios u ON u.id = v.id_usuario
      ORDER BY v.fecha DESC
    `);

    res.json(rows ?? []);
  } catch (err) {
    console.error("Error en GET ventas:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* ======================================================
   GET: DETALLE DE UNA VENTA
====================================================== */
router.get("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    const [venta] = await db.query(
      `
      SELECT v.*, u.nombre AS usuario_nombre, u.email AS usuario_correo
      FROM ventas v
      LEFT JOIN usuarios u ON u.id = v.id_usuario
      WHERE v.id = ?
    `,
      [id]
    );

    if (!venta || venta.length === 0)
      return res.status(404).json({ error: "Venta no encontrada" });

    const [items] = await db.query(
      `
      SELECT 
        d.id_producto, 
        d.cantidad, 
        d.subtotal, 
        p.nombre, 
        p.precio, 
        p.imagenes
      FROM ventas_detalle d
      JOIN productos p ON p.id = d.id_producto
      WHERE d.id_venta = ?
    `,
      [id]
    );

    res.json({
      id: venta[0].id,
      fecha: venta[0].fecha,
      total: venta[0].total,
      usuario: venta[0].usuario_nombre || "Cliente Anónimo",
      correo: venta[0].usuario_correo || "Sin correo",
      detalle: procesarImagenes(items),
    });
  } catch (err) {
    console.error("Error en GET venta/:id:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* ======================================================
   POST: REGISTRAR VENTA
====================================================== */
router.post("/", authRequired, async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;
  const tokenSecreto = generateToken();

  if (!items || items.length === 0)
    return res.status(400).json({ error: "Carrito vacío" });

  try {
    const [venta] = await db.query(
      `
      INSERT INTO ventas (id_usuario, total, token, fecha)
      VALUES (?, ?, ?, NOW())
    `,
      [userId, total, tokenSecreto]
    );

    const ventaId = venta.insertId;

    for (const item of items) {
      await db.query(
        `
        INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, subtotal)
        VALUES (?, ?, ?, ?)
      `,
        [ventaId, item.id_producto, item.cantidad, item.precio * item.cantidad]
      );

      await db.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.id_producto]
      );
    }

    res.status(201).json({ id: ventaId, token: tokenSecreto });
  } catch (err) {
    console.error("Error registrando venta:", err);
    res.status(500).json({ error: "Error interno: " + err.message });
  }
});

export default router;
