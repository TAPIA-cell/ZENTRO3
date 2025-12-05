import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [cargando, setCargando] = useState(true);

  const PLACEHOLDER_IMG =
    "https://placehold.co/600x400/F4FAFF/7d8a99?text=Sin+Imagen";

  const z = {
    primary: "#00AEEF",
    primaryDark: "#003459",
    soft: "rgba(0,174,239,0.12)",
    softBg: "#F4FAFF",
    textGray: "#7d8a99",
  };

  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const HOST = BACKEND_URL.replace("/api", "");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/blogs`, { signal });
        if (!res.ok) throw new Error("Error al obtener noticias");

        const data = await res.json();
        if (Array.isArray(data)) {
          setBlogs(
            data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          );
        } else {
          setBlogs([]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setBlogs([]);
        }
      } finally {
        if (!signal.aborted) setCargando(false);
      }
    };

    fetchBlogs();
    return () => controller.abort();
  }, []);

  const getImg = (src) => {
    if (!src) return PLACEHOLDER_IMG;
    if (src.startsWith("/img/")) return `${HOST}${src}`;
    if (src.startsWith("http")) return src;
    return PLACEHOLDER_IMG;
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    return new Date(fechaString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="container my-5"
      style={{
        minHeight: "60vh",
      }}
    >
      {/* HEADER */}
      <div className="text-center mb-5">
        <h2
          className="fw-bold"
          style={{ color: z.primaryDark, fontSize: "2.4rem" }}
        >
          📰 Últimas Noticias
        </h2>
        <p className="text-muted" style={{ color: z.textGray }}>
          Mantente al día con lo más reciente.
        </p>
      </div>

      {/* LOADING */}
      {cargando ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div
            className="spinner-border"
            style={{ color: z.primary }}
            role="status"
          ></div>
          <span className="ms-3" style={{ color: z.textGray }}>
            Cargando noticias...
          </span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h1 className="display-1" style={{ color: z.textGray }}>
            📭
          </h1>
          <p className="lead" style={{ color: z.textGray }}>
            No hay artículos disponibles…
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-12 col-md-6 col-lg-4" key={blog.id}>
              <div
                className="card h-100 border-0 shadow-sm blog-card"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#FFF",
                }}
              >
                {/* Imagen */}
                <div className="blog-img-wrapper">
                  <img
                    src={getImg(blog.imagen)}
                    alt={blog.titulo}
                    className="blog-img"
                    onError={(e) => (e.target.src = PLACEHOLDER_IMG)}
                  />
                </div>

                {/* Cuerpo */}
                <div className="card-body p-4 d-flex flex-column">
                  <small
                    className="fw-semibold text-uppercase"
                    style={{ color: z.primary }}
                  >
                    {blog.autor || "Redacción"} — {formatearFecha(blog.fecha)}
                  </small>

                  <h5
                    className="fw-bold mt-2"
                    style={{ color: z.primaryDark }}
                  >
                    {blog.titulo}
                  </h5>

                  <p className="text-muted flex-grow-1 blog-extract">
                    {blog.contenido}
                  </p>

                  <Link
                    to={`/blogs/${blog.id}`}
                    className="btn fw-bold mt-3 w-100"
                    style={{
                      background: z.primary,
                      color: "#fff",
                      borderRadius: "40px",
                      padding: "10px 20px",
                    }}
                  >
                    Leer artículo →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ESTILOS */}
      <style>{`
        .blog-card {
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,0,0,.12);
        }

        .blog-img-wrapper {
          height: 240px;
          overflow: hidden;
        }

        .blog-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }

        .blog-card:hover .blog-img {
          transform: scale(1.07);
        }

        .blog-extract {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}
