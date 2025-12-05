import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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

export default function AdminBlogs() {
  const { token } = useContext(AuthContext);

  const [blogs, setBlogs] = useState([]);
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [blogActual, setBlogActual] = useState({
    id: null,
    titulo: "",
    autor: "",
    fecha: "",
    contenido: "",
    imagen: "",
  });

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const API_URL = `${BACKEND_URL}/blogs`;

  /* ======================================================
     📥 CARGAR BLOGS
     ====================================================== */
  const cargarBlogs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error cargando blogs:", error);
    }
  };

  useEffect(() => {
    cargarBlogs();
  }, []);

  /* ======================================================
     🖼 SUBIR IMAGEN
     ====================================================== */
  const subirImagen = async () => {
    if (!imagenFile) return blogActual.imagen;

    const formData = new FormData();
    formData.append("imagen", imagenFile);

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  /* ======================================================
     💾 GUARDAR BLOG
     ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const imagenFinal = imagenFile ? await subirImagen() : blogActual.imagen;

    const payload = { ...blogActual, imagen: imagenFinal };

    const metodo = blogActual.id ? "PUT" : "POST";
    const url = blogActual.id ? `${API_URL}/${blogActual.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return alert("Error al guardar el blog");

      limpiarFormulario();
      cargarBlogs();
    } catch (err) {
      console.error("Error guardando blog:", err);
      alert("Error al guardar el blog");
    }
  };

  /* ======================================================
     ✏ EDITAR BLOG
     ====================================================== */
  const handleEditar = (blog) => {
    setBlogActual({ ...blog, fecha: blog.fecha.split("T")[0] });
    setImagenFile(null);
    setPreview(blog.imagen);
  };

  /* ======================================================
     🗑 ELIMINAR BLOG
     ====================================================== */
  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar blog?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarBlogs();
    } catch (error) {
      alert("No autorizado");
    }
  };

  /* ======================================================
     📸 PREVIEW
     ====================================================== */
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  /* ======================================================
     🔄 LIMPIAR
     ====================================================== */
  const limpiarFormulario = () => {
    setBlogActual({
      id: null,
      titulo: "",
      autor: "",
      fecha: "",
      contenido: "",
      imagen: "",
    });

    setImagenFile(null);
    setPreview(null);
  };

  /* ======================================================
     🖼 RENDER
     ====================================================== */

  return (
    <div className="container py-4" style={{ background: zentro.soft, borderRadius: "14px" }}>
      
      {/* TÍTULO */}
      <h2 className="fw-bold text-center mb-4" style={{ color: zentro.dark }}>
        📰 Gestión de Blogs
      </h2>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow-sm mb-5"
        style={{
          background: "#fff",
          border: `1px solid ${zentro.lightBorder}`,
        }}
      >
        <h5 className="fw-bold mb-3" style={{ color: zentro.dark }}>
          {blogActual.id ? "✏ Editar Blog" : "✨ Nuevo Blog"}
        </h5>

        <div className="row g-3">

          <div className="col-md-6">
            <input
              type="text"
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              placeholder="Título"
              value={blogActual.titulo}
              onChange={(e) => setBlogActual({ ...blogActual, titulo: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              type="text"
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              placeholder="Autor"
              value={blogActual.autor}
              onChange={(e) => setBlogActual({ ...blogActual, autor: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              type="date"
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              value={blogActual.fecha}
              onChange={(e) => setBlogActual({ ...blogActual, fecha: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              type="file"
              accept="image/*"
              className="form-control shadow-sm"
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              onChange={handleImagenChange}
            />
          </div>

          {preview && (
            <div className="text-center mt-3">
              <img
                src={preview}
                height="140"
                className="rounded shadow-sm border"
                alt="preview"
              />
            </div>
          )}

          <div className="col-12">
            <textarea
              className="form-control shadow-sm"
              rows="4"
              placeholder="Contenido del blog..."
              style={{ background: zentro.bgField, borderColor: zentro.lightBorder }}
              value={blogActual.contenido}
              onChange={(e) => setBlogActual({ ...blogActual, contenido: e.target.value })}
              required
            />
          </div>

          <div className="col-12 d-flex gap-2 mt-2">
            <button className="btn fw-bold shadow-sm" style={{ background: zentro.primary, color: "#fff" }}>
              💾 Guardar
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          </div>

        </div>
      </form>

      {/* TABLA */}
      <div className="card shadow-sm border-0">
        <div
          className="card-header text-white fw-bold"
          style={{
            background: zentro.dark,
            borderBottom: "1px solid #0a2b66",
          }}
        >
          📑 Lista de Blogs
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ background: "#eef1f6" }}>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Imagen</th>
                <th>Autor</th>
                <th>Fecha</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>

                  <td>{b.id}</td>

                  <td className="fw-semibold">{b.titulo}</td>

                  <td>
                    {b.imagen ? (
                      <img src={b.imagen} width="80" className="rounded shadow-sm" />
                    ) : (
                      <span className="text-muted small">Sin imagen</span>
                    )}
                  </td>

                  <td>{b.autor}</td>

                  <td>{new Date(b.fecha).toLocaleDateString()}</td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">

                      <button
                        className="btn btn-warning btn-sm"
                        style={{ borderRadius: "8px" }}
                        onClick={() => handleEditar(b)}
                      >
                        ✏️
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        style={{ borderRadius: "8px" }}
                        onClick={() => handleEliminar(b.id)}
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
