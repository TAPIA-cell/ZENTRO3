import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_BASE = BACKEND_URL.replace("/api", "");
const PLACEHOLDER = "/img/placeholder.jpg";

// =========================================================
// Normalizar imagen según backend
// =========================================================
const imagenSegura = (src) => {
  if (!src) return `${API_BASE}${PLACEHOLDER}`;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/img/")) return `${API_BASE}${src}`;
  if (src.startsWith("img/")) return `${API_BASE}/${src}`;

  const limpio = src
    .replace("public/", "")
    .replace("uploads/", "")
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/?img\//, "")
    .trim();

  return `${API_BASE}/img/${limpio}`;
};

export default function BlogsDetalle() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const z = {
    primary: "#00AEEF",
    primaryDark: "#003459",
    gray: "#7d8a99",
    soft: "#F4FAFF",
  };

  const fechaLinda = (f) =>
    new Date(f).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // =========================================================
  // Cargar Blog
  // =========================================================
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/blogs/${id}`, { signal });
        if (!res.ok) throw new Error("Blog no encontrado");

        setBlog(await res.json());
      } catch (err) {
        if (err.name !== "AbortError") setError(true);
      } finally {
        if (!signal.aborted) setCargando(false);
      }
    };

    fetchBlog();
    return () => controller.abort();
  }, [id]);

  // =========================================================
  // LOADING
  // =========================================================
  if (cargando) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" style={{ color: z.primary }}></div>
        <p className="mt-3" style={{ color: z.gray, fontSize: "1.1rem" }}>
          Cargando artículo...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !blog) {
    return (
      <div className="container text-center py-5">
        <h1 className="fw-bold mb-3" style={{ color: z.primaryDark }}>
          😕 Blog no encontrado
        </h1>
        <p className="text-muted mb-4" style={{ color: z.gray }}>
          El artículo podría haber sido eliminado.
        </p>

        <Link
          to="/blogs"
          className="btn fw-bold px-4 py-2"
          style={{
            borderRadius: "40px",
            border: `2px solid ${z.primary}`,
            color: z.primaryDark,
          }}
        >
          ← Volver al Blog
        </Link>
      </div>
    );
  }

  // =========================================================
  // VISTA PRINCIPAL — PROFESIONAL ZENTRO
  // =========================================================
  return (
    <div className="container my-5" style={{ maxWidth: "900px" }}>
      
      {/* TITLE */}
      <h1
        className="fw-bold text-center mb-3"
        style={{
          fontSize: "2.7rem",
          color: z.primaryDark,
          lineHeight: "3.1rem",
        }}
      >
        {blog.titulo}
      </h1>

      {/* AUTOR - FECHA */}
      <p
        className="text-center mb-4"
        style={{
          fontSize: "1.05rem",
          color: z.gray,
        }}
      >
        ✍️ <strong style={{ color: z.primaryDark }}>{blog.autor}</strong> ·{" "}
        {fechaLinda(blog.fecha)}
      </p>

      {/* FEATURED IMAGE */}
      <div
        className="shadow mb-4 position-relative overflow-hidden"
        style={{
          borderRadius: "22px",
          maxHeight: "520px",
          background: z.soft,
        }}
      >
        <img
          src={imagenSegura(blog.imagen)}
          alt={blog.titulo}
          className="img-fluid w-100"
          style={{
            height: "100%",
            objectFit: "cover",
            transition: "0.5s",
          }}
          onError={(e) => (e.target.src = PLACEHOLDER)}
        />

        {/* Overlay degradado suave */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: 0,
            right: 0,
            height: "35%",
            background:
              "linear-gradient(transparent, rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
          }}
        ></div>
      </div>

      {/* CONTENT */}
      <div
        className="p-4 shadow-sm rounded-4"
        style={{
          background: "#fff",
          fontSize: "1.22rem",
          lineHeight: "1.95rem",
          color: "#333",
          whiteSpace: "pre-line",
          borderLeft: `6px solid ${z.primary}`,
        }}
      >
        {blog.contenido}
      </div>

      {/* BACK BUTTON */}
      <div className="text-center mt-5">
        <Link
          to="/blogs"
          className="btn fw-bold px-4 py-2 shadow-sm"
          style={{
            background: z.primary,
            color: "#fff",
            borderRadius: "40px",
            fontSize: "1.1rem",
          }}
        >
          ← Volver al Blog
        </Link>
      </div>

      {/* IMAGE HOVER EFFECT */}
      <style>{`
        img:hover {
          filter: brightness(1.06);
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
