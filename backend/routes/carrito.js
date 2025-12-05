/**
 * @openapi
 * tags:
 *   name: Carrito
 *   description: Agregar, quitar y consultar carrito.
 */

/**
 * @openapi
 * /carrito:
 *   get:
 *     tags: [Carrito]
 *     summary: Obtener carrito del usuario.
 *     responses:
 *       200: { description: Carrito cargado }
 */

/**
 * @openapi
 * /carrito/agregar:
 *   post:
 *     tags: [Carrito]
 *     summary: Agregar producto al carrito.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_producto: { type: number }
 *               cantidad: { type: number }
 *     responses:
 *       200: { description: Producto agregado }
 */

/**
 * @openapi
 * /carrito/{id}:
 *   delete:
 *     tags: [Carrito]
 *     summary: Eliminar producto del carrito.
 */


// backend/routes/carrito.js
import express from "express";
import db from "../database.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   GET: OBTENER CARRITO
===================================================== */
router.get("/", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    const [items] = await db.query(
      `SELECT 
          ci.id AS cartItemId,
          ci.cantidad,
          p.id AS id,
          p.id AS id_producto,
          p.nombre,
          p.precio,
          p.descripcion,
          p.stock,
          p.imagenes
        FROM carrito_items ci
        JOIN productos p ON p.id = ci.id_producto
        WHERE ci.id_usuario = ?`,
      [userId]
    );

    // Normalizar imágenes (evitar errores de JSON)
    const carrito = items.map((item) => {
      let imgs = [];
      try {
        imgs = typeof item.imagenes === 'string' ? JSON.parse(item.imagenes) : item.imagenes;
      } catch (e) {
        imgs = [];
      }

      return {
        ...item,
        imagenes: Array.isArray(imgs) ? imgs : [],
      };
    });

    res.json(carrito);
  } catch (err) {
    console.error("Error obteniendo carrito:", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =====================================================
   POST: AGREGAR (+1) O INSERTAR NUEVO
   (Usado por el botón "Comprar" de la tienda)
===================================================== */
router.post("/", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    let { productoId } = req.body;

    // 1. Limpieza: Si el frontend envía un objeto, sacamos el ID
    if (typeof productoId === 'object' && productoId !== null) {
        productoId = productoId.id || productoId.id_producto;
    }

    if (!productoId) {
      return res.status(400).json({ error: "ID de producto requerido" });
    }

    // 2. Seguridad: Verificar que el producto EXISTA en la tabla productos
    const [productoExiste] = await db.query("SELECT id FROM productos WHERE id = ?", [productoId]);
    if (productoExiste.length === 0) {
        return res.status(404).json({ error: "El producto ya no existe en la tienda." });
    }

    // 3. Lógica: ¿Ya está en el carrito?
    const [rows] = await db.query(
      "SELECT id, cantidad FROM carrito_items WHERE id_usuario=? AND id_producto=?",
      [userId, productoId]
    );

    if (rows.length > 0) {
      // Si existe, SUMAMOS 1
      const cantidadNueva = rows[0].cantidad + 1;
      await db.query(
        "UPDATE carrito_items SET cantidad=? WHERE id=?",
        [cantidadNueva, rows[0].id]
      );
      return res.json({ ok: true, mensaje: "Cantidad aumentada", cantidad: cantidadNueva });
    }

    // Si no existe, CREAMOS el registro
    await db.query(
      "INSERT INTO carrito_items (id_usuario, id_producto, cantidad) VALUES (?, ?, 1)",
      [userId, productoId]
    );

    res.json({ ok: true, mensaje: "Producto agregado" });

  } catch (err) {
    console.error("Error agregando producto:", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =====================================================
   PUT: ACTUALIZAR CANTIDAD EXACTA
   (Usado por los botones "+" y "-" del Carrito)
===================================================== */
router.put("/", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ error: "Faltan datos (productoId o cantidad)" });
    }

    // Actualizamos a la cantidad exacta que pide el frontend
    await db.query(
      "UPDATE carrito_items SET cantidad=? WHERE id_usuario=? AND id_producto=?",
      [cantidad, userId, productoId]
    );

    res.json({ ok: true, mensaje: "Cantidad actualizada correctamente" });
  } catch (err) {
    console.error("Error actualizando cantidad:", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =====================================================
   DELETE: VACIAR CARRITO
   ⚠️ CAMBIO IMPORTANTE: Esta ruta ahora está ANTES de /:id
   para evitar que Express confunda "vaciar" con un ID.
===================================================== */
router.delete("/vaciar", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      "DELETE FROM carrito_items WHERE id_usuario=?",
      [userId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Error vaciando carrito:", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =====================================================
   DELETE: ELIMINAR UN PRODUCTO
   (Captura cualquier ID que no sea "vaciar")
===================================================== */
router.delete("/:id", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // Puede ser id del item o id del producto

    // Intentamos borrar coincidiendo id_producto O id del item (para ser flexibles)
    await db.query(
      "DELETE FROM carrito_items WHERE (id_producto=? OR id=?) AND id_usuario=?",
      [id, id, userId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando producto:", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

export default router;