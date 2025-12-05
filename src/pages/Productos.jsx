import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

// Toast bonito
const Toast = ({ mensaje, onClose }) => (
  <div
    className="toast-container position-fixed bottom-0 end-0 p-4"
    style={{ zIndex: 2000 }}
  >
    <div className="toast show text-white bg-success shadow-lg rounded-3">
      <div className="toast-body d-flex justify-content-between align-items-center">
        {mensaje}
        <button className="btn-close btn-close-white" onClick={onClose}></button>
      </div>
    </div>
  </div>
);

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("default");
  const [cargando, setCargando] = useState(true);
  const [mensajeToast, setMensajeToast] = useState(null);

  const { agregarAlCarrito } = useContext(CartContext);
  const { isLogged } = useContext(AuthContext);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Resolver imágenes
  const resolverURL = (src) => {
    if (!src) return "/img/placeholder.jpg";
    const BASE_URL = BACKEND_URL.replace("/api", "");

    if (src.startsWith("/img/")) return `${BASE_URL}${src}`;
    if (src.startsWith("img/")) return `${BASE_URL}/${src}`;
    if (src.startsWith("http")) return src;
    return `${BASE_URL}/img/${src}`;
  };

  // Cargar productos
  useEffect(() => {
    setCargando(true);
    fetch(`${BACKEND_URL}/productos`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return setProductos([]);
        const normalizados = data.map((p) => ({
          ...p,
          imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
        }));
        setProductos(normalizados);
      })
      .catch((err) => console.error("Error cargando catálogo:", err))
      .finally(() => setCargando(false));
  }, []);

  // Filtro + orden
  const productosFiltrados = useMemo(() => {
    let resultado = productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (orden === "precioAsc") resultado.sort((a, b) => a.precio - b.precio);
    if (orden === "precioDesc") resultado.sort((a, b) => b.precio - a.precio);

    return resultado;
  }, [productos, busqueda, orden]);

  // Agregar al carrito
  const handleAgregar = (producto) => {
    if (!isLogged()) {
      if (window.confirm("🔒 Debes iniciar sesión para comprar. ¿Ir al login?")) {
        navigate("/login");
      }
      return;
    }

    agregarAlCarrito(producto);
    setMensajeToast(`🛒 ${producto.nombre} fue agregado al carrito`);
    setTimeout(() => setMensajeToast(null), 3000);
  };

  return (
    <div className="container my-5 position-relative">

      <h2 className="fw-bold text-center mb-4">✨ Nuestros Productos ✨</h2>

      {/* Buscador + Orden */}
      <div className="row mb-4 align-items-center bg-white p-3 rounded shadow-sm border">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar figuras, katanas, accesorios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <select
            className="form-select w-auto d-inline"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="default">Ordenar por</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Loader */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2 text-muted">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="row g-4">

          {productosFiltrados.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">
              <h4>😕</h4> No encontramos productos.
            </div>
          ) : (
            productosFiltrados.map((p) => {
              const hayStock = p.stock > 0;
              const primeraImg =
                p.imagenes.length > 0 ? resolverURL(p.imagenes[0]) : "/img/placeholder.jpg";

              return (
                <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                  <div
                    className={`card h-100 border-0 shadow-sm product-card rounded-3 position-relative overflow-hidden ${
                      !hayStock ? "sin-stock" : ""
                    }`}
                  >
                    {/* CINTA AGOTADO */}
                    {!hayStock && (
                      <div className="ribbon-wrapper">
                        <span className="ribbon">AGOTADO</span>
                      </div>
                    )}

                    {/* Imagen */}
                    <div className="product-img-container">
                      <img
                        src={primeraImg}
                        alt={p.nombre}
                        className="product-img"
                        onError={(e) => (e.target.src = "/img/placeholder.jpg")}
                      />
                    </div>

                    {/* Info */}
                    <div className="card-body text-center d-flex flex-column">
                      <h6 className="fw-bold text-truncate" title={p.nombre}>
                        {p.nombre}
                      </h6>

                      <p className="text-primary fw-bold fs-5 mb-2">
                        ${Number(p.precio).toLocaleString("es-CL")}
                      </p>

                      <div className="mt-auto">
                        <Link to={`/producto/${p.id}`} className="btn btn-outline-secondary btn-sm me-2">
                          Ver
                        </Link>

                        <button
                          className={`btn btn-sm ${hayStock ? "btn-dark" : "btn-light text-muted border"}`}
                          disabled={!hayStock}
                          onClick={() => handleAgregar(p)}
                        >
                          {hayStock ? "🛒 Agregar" : "Sin Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {mensajeToast && <Toast mensaje={mensajeToast} onClose={() => setMensajeToast(null)} />}

      {/* ESTILOS */}
      <style>{`
        /* Imagen */
        .product-img-container {
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          padding: 15px;
        }
        .product-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform .3s ease;
        }
        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        /* Productos agotados */
        .sin-stock .product-img {
          opacity: 0.55;
          filter: grayscale(85%);
        }

        /* CINTA AGOTADO */
        .ribbon-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 120px;
          overflow: hidden;
          z-index: 10;
          pointer-events: none;
        }

        .ribbon {
          background: linear-gradient(135deg, #d3212d, #b5000f);
          color: #fff;
          text-align: center;
          font-weight: 900;
          font-size: 0.8rem;
          text-transform: uppercase;
          position: absolute;
          top: 15px;
          right: -40px;
          width: 150px;
          padding: 8px 0;
          transform: rotate(45deg);
          box-shadow: 0 6px 12px rgba(0,0,0,0.35);
          transition: transform .25s ease-in-out;
        }

        .product-card:hover .ribbon {
          transform: rotate(45deg) scale(1.12);
        }
      `}</style>
    </div>
  );
}

export default Productos;
