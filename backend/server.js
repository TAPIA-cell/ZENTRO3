import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "./database.js";

import { swaggerSpec, swaggerUi } from "./swagger.js";
import productosRoutes from "./routes/productos.js";
import blogsRoutes from "./routes/blogs.js";
import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import carritoRoutes from "./routes/carrito.js";
import ventasRoutes from "./routes/ventas.js";
import uploadRoutes from "./routes/upload.js";  // <-- 🔥 AGREGADO

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/img", express.static(path.join(__dirname, "../public/img")));
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/productos", productosRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/ventas", ventasRoutes);

app.use("/api/upload", uploadRoutes);  // <-- 🔥 NECESARIO

app.get("/", (req, res) => {
  res.send("API Zentro funcionando ✅");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Backend ON");
});
