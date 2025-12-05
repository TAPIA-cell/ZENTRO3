import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/* ======================================================
   🎨 PALETA ZENTRO
   ====================================================== */
const zentro = {
  primary: "#00AEEF",
  primaryRGB: "0,174,239",
  dark: "#003459",
  soft: "#F4FAFF",
  lightBorder: "#d8dce2",
  bgField: "#f8f9fb",
};

export default function AdminProductos() {
  const { token } = useContext(AuthContext);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const API_URL = `${BACKEND_URL}/productos`;

  const [productos, setProductos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [productoActual, setProductoActual] = useState({
    id: null,
    nombre: "",
    precio: "",
    descripcion: "",
    stock: 0,
    imagenes: [],
  });

  const [nuevaImagen, setNuevaImagen] = useState("");

  /* ======================================================
     🔄 PARSEAR IMÁGENES
     ====================================================== */
  const parsearImagenes = (imgData) => {
    if (!imgData) return [];
    try {
      if (Array.isArray(imgData)) return imgData;
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  /* ======================================================
     📥 CARGAR PRODUCTOS
     ====================================================== */
  const cargarProductos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      setProductos(
        (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          imagenes: parsearImagenes(p.imagenes),
        }))
      );
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  /* ======================================================
     📤 SUBIR ARCHIVO
     ====================================================== */
  const subirArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("imagen", archivo);

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setProductoActual((prev) => ({
          ...prev,
          imagenes: [...prev.imagenes, data.url],
        }));
      }
    } catch (err) {
      console.error("Error subiendo archivo:", err);
    }
  };

  /* ======================================================
     ➕ AGREGAR IMAGEN POR URL
     ====================================================== */
  const agregarImagen = () => {
    if (!nuevaImagen.trim()) return;

    setProductoActual((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, nuevaImagen.trim()],
    }));

    setNuevaImagen("");
  };

  /* ======================================================
     ❌ QUITAR IMAGEN
     ====================================================== */
  const quitarImagen = (index) => {
    setProductoActual((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  /* ======================================================
     💾 GUARDAR PRODUCTO
     ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: productoActual.nombre.trim(),
      precio: Number(productoActual.precio),
      descripcion: productoActual.descripcion.trim(),
      stock: Number(productoActual.stock),
      imagenes: productoActual.imagenes,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      let res;

      if (isEditing) {
        res = await fetch(`${API_URL}/${productoActual.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al guardar");
        return;
      }

      limpiar();
      cargarProductos();
    } catch (err) {
      console.error("Error guardando:", err);
    }
  };

  /* ======================================================
     ✏️ EDITAR
     ====================================================== */
  const handleEditar = (prod) => {
    setProductoActual({
      id: prod.id,
      nombre: prod.nombre,
      precio: Number(prod.precio),
      descripcion: prod.descripcion || "",
      stock: Number(prod.stock),
      imagenes: parsearImagenes(prod.imagenes),
    });

    setIsEditing(true);
  };

  /* ======================================================
     🧹 LIMPIAR
     ====================================================== */
  const limpiar = () => {
    setProductoActual({
      id: null,
      nombre: "",
      precio: "",
      descripcion: "",
      stock: 0,
      imagenes: [],
    });

    setNuevaImagen("");
    setIsEditing(false);
  };

  /* ======================================================
     🌐 RESOLVER URL
     ====================================================== */
  const resolverURL = (img) => {
    if (!img) return "/img/placeholder.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/img/")) return img;

    const limpio = img
      .replace("backend/public/", "")
      .replace("public/", "")
      .replace(/^\/+/, "");

    return "/img/" + limpio;
  };

  /* ======================================================
     🗑 ELIMINAR
     ====================================================== */
  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      cargarProductos();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  /* ======================================================
     🎨 RENDER
     ====================================================== */

  return (
    <div className="container py-4" style={{ background: zentro.soft, borderRadius: "14px" }}>

      <h2 className="fw-bold mb-4" style={{ color: zentro.dark }}>
        🛍️ Gestión de Productos
      </h2>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow-sm mb-4"
        style={{
          background: "#fff",
          borderLeft: `6px solid ${zentro.primary}`,
        }}
      >
        <h4 className="fw-bold" style={{ color: zentro.dark }}>
          {isEditing ? "✏️ Editar Producto" : "✨ Nuevo Producto"}
        </h4>

        <div className="row mt-3 g-3">
          <div className="col-md-4">
            <label className="fw-semibold">Nombre</label>
            <input
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              value={productoActual.nombre}
              onChange={(e) =>
                setProductoActual({ ...productoActual, nombre: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Precio</label>
            <input
              type="number"
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              value={productoActual.precio}
              onChange={(e) =>
                setProductoActual({ ...productoActual, precio: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Stock</label>
            <input
              type="number"
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              value={productoActual.stock}
              onChange={(e) =>
                setProductoActual({ ...productoActual, stock: e.target.value })
              }
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="col-md-12">
            <label className="fw-semibold">Descripción</label>
            <textarea
              className="form-control shadow-sm"
              rows={3}
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              value={productoActual.descripcion}
              onChange={(e) =>
                setProductoActual({ ...productoActual, descripcion: e.target.value })
              }
            />
          </div>

          {/* IMÁGENES */}
          <div className="col-12">
            <label className="fw-semibold">Imágenes del Producto</label>

            {/* URL */}
            <div className="input-group mb-2">
              <input
                className="form-control shadow-sm"
                style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
                placeholder="Pegar URL de imagen"
                value={nuevaImagen}
                onChange={(e) => setNuevaImagen(e.target.value)}
              />
              <button
                type="button"
                className="btn fw-bold"
                style={{ background: zentro.primary, color: "#fff" }}
                onClick={agregarImagen}
              >
                ➕
              </button>
            </div>

            {/* SUBIR ARCHIVO */}
            <input
              type="file"
              accept="image/*"
              onChange={subirArchivo}
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
            />

            {/* PREVIEW */}
            <div className="d-flex flex-wrap gap-3 mt-3">
              {productoActual.imagenes.map((img, i) => (
                <div key={i} className="position-relative">
                  <img
                    src={resolverURL(img)}
                    width="90"
                    height="90"
                    className="rounded shadow-sm border object-fit-cover"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 py-0 px-1"
                    style={{ borderRadius: "6px" }}
                    onClick={() => quitarImagen(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn fw-bold mt-3 px-4"
          style={{ background: zentro.primary, color: "#fff" }}
        >
          {isEditing ? "Actualizar Producto" : "Crear Producto"}
        </button>

        <button
          className="btn btn-outline-secondary mt-3 ms-2"
          type="button"
          onClick={limpiar}
        >
          Cancelar
        </button>
      </form>

      {/* TABLA */}
      <div className="card shadow-sm border-0">
        <div
          className="card-header text-white fw-bold"
          style={{ background: zentro.dark }}
        >
          Inventario
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: "#eef1f6" }}>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Imágenes</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="fw-semibold">{p.nombre}</td>
                  <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                  <td className="fw-bold">{p.stock}</td>

                  <td>
                    {p.imagenes.length ? (
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={resolverURL(p.imagenes[0])}
                          width="50"
                          height="50"
                          className="rounded shadow-sm border object-fit-cover"
                        />
                        {p.imagenes.length > 1 && (
                          <span className="text-muted small">
                            +{p.imagenes.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted small">Sin imagen</span>
                    )}
                  </td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditar(p)}
                      >
                        ✏️
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(p.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
