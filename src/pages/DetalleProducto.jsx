import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

// ======================================================
// 🔔 Toast Moderno
// ======================================================
const Toast = ({ mensaje, onClose }) => (
  <div
    className="toast-container position-fixed bottom-0 end-0 p-4"
    style={{ zIndex: 2000 }}
  >
    <div className="toast show bg-dark text-white shadow-lg rounded-3 px-3 py-2">
      <div className="toast-body d-flex justify-content-between align-items-center">
        <span className="fw-semibold">{mensaje}</span>
        <button
          className="btn-close btn-close-white ms-3"
          onClick={onClose}
        ></button>
      </div>
    </div>
  </div>
);

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CartContext);
  const { isLogged } = useContext(AuthContext);

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const BASE_URL = BACKEND_URL.replace("/api", "");

  // ======================================================
  // Resolver imagen como en ZENTRO Admin
  // ======================================================
  const resolverURL = (src) => {
    if (!src) return "/img/placeholder.jpg";
    const BASE = BASE_URL;

    if (src.startsWith("/img/")) return `${BASE}${src}`;
    if (src.startsWith("img/")) return `${BASE}/${src}`;
    if (src.startsWith("http")) return src;
    return `${BASE}/img/${src}`;
  };

  // ======================================================
  // Cargar producto
  // ======================================================
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setCargando(true);
    setError(false);

    fetch(`${BACKEND_URL}/productos/${id}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        document.title = `${data.nombre} | Zentro Store`;
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      })
      .finally(() => !signal.aborted && setCargando(false));

    return () => controller.abort();
  }, [id]);

  // ======================================================
  // Procesar imágenes una sola vez
  // ======================================================
  const imagenesValidas = useMemo(() => {
    if (!producto) return [];
    let imgs = [];

    if (Array.isArray(producto.imagenes)) imgs = producto.imagenes;
    else if (typeof producto.imagenes === "string") {
      try {
        imgs = JSON.parse(producto.imagenes);
      } catch {
        imgs = [];
      }
    }

    return imgs
      .map((i) => resolverURL(i))
      .filter((i) => i && typeof i === "string" && i.trim() !== "");
  }, [producto]);

  // ======================================================
  // Agregar al carrito
  // ======================================================
  const handleAgregar = () => {
    if (!isLogged()) {
      if (window.confirm("🔐 Debes iniciar sesión para comprar. ¿Ir ahora?"))
        navigate("/login");

      return;
    }

    agregarAlCarrito(producto);
    setToastMsg(`🛒 ${producto.nombre} se agregó al carrito`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ======================================================
  // Loading y Error
  // ======================================================
  if (cargando)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">Cargando...</p>
      </div>
    );

  if (error)
    return (
      <div className="container text-center py-5">
        <h2 className="text-danger fw-bold">Producto no encontrado</h2>
        <p className="text-muted">Puede haber sido movido o eliminado.</p>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/productos")}>
          Volver al catálogo
        </button>
      </div>
    );

  // ======================================================
  // STOCK
  // ======================================================
  const stock = Number(producto.stock) || 0;
  const stockDisponible = stock > 0;

  let stockBadge = { class: "bg-danger", text: "Agotado" };

  if (stockDisponible) {
    if (stock <= 5)
      stockBadge = {
        class: "bg-warning text-dark",
        text: `Últimas ${stock} unidades`,
      };
    else stockBadge = { class: "bg-success", text: "En stock" };
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="container py-5 fade-in">
      <div className="row g-5 align-items-start">

        {/* ===================================== */}
        {/* 🔵 CAROUSEL */}
        {/* ===================================== */}
        <div className="col-md-6">
          <div
            id="carouselProducto"
            className="carousel slide border rounded-4 shadow-sm overflow-hidden"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner bg-white">

              {imagenesValidas.length > 0 ? (
                imagenesValidas.map((img, i) => (
                  <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "450px" }}>
                      <img
                        src={img}
                        className="d-block"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="carousel-item active">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "450px" }}>
                    <img
                      src="/img/placeholder.jpg"
                      className="d-block opacity-50"
                      alt="No image"
                    />
                  </div>
                </div>
              )}

            </div>

            {imagenesValidas.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselProducto"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon bg-dark rounded-circle p-3"></span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselProducto"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon bg-dark rounded-circle p-3"></span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ===================================== */}
        {/* 🧾 INFORMACIÓN */}
        {/* ===================================== */}
        <div className="col-md-6">

          <small className="text-muted fw-bold text-uppercase mb-1 d-block">
            Código #{producto.id}
          </small>

          <h1 className="fw-bold mb-3">{producto.nombre}</h1>

          <p className="text-secondary lead">{producto.descripcion}</p>

          <div className="d-flex align-items-center mt-4 mb-4">
            <h2 className="fw-bold text-dark me-3">
              ${Number(producto.precio).toLocaleString("es-CL")}
            </h2>
            <span className={`badge rounded-pill px-3 py-2 ${stockBadge.class}`}>
              {stockBadge.text}
            </span>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              className={`btn btn-lg flex-grow-1 rounded-pill shadow-sm ${
                stockDisponible ? "btn-dark" : "btn-secondary disabled"
              }`}
              onClick={handleAgregar}
              disabled={!stockDisponible}
            >
              {stockDisponible ? "🛒 Agregar al carrito" : "Agotado"}
            </button>

            <button
              className="btn btn-lg btn-outline-secondary rounded-pill"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </div>

      </div>

      {toastMsg && <Toast mensaje={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* Estilos FX */}
      <style>{`
        .fade-in {
          animation: fadeIn .5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .carousel-item img {
          transition: transform .4s ease;
        }
        .carousel-item:hover img {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

export default DetalleProducto;
