import { useEffect, useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

// ==========================================
// UTILS (Idealmente mover a /utils/images.js)
// ==========================================
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// Intentamos obtener el host base de forma segura
const getHost = () => {
  try {
    return new URL(BACKEND_URL).origin;
  } catch {
    return "http://localhost:3000"; // Fallback
  }
};
const HOST = getHost();

const resolverURL = (img) => {
  if (!img) return `${HOST}/img/placeholder.jpg`;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/img/")) return `${HOST}${img}`;
  return `${HOST}/img/${img}`;
};

// ==========================================
// SUB-COMPONENTE: Tarjeta de Producto
// ==========================================
const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 shadow-sm border-0 product-card position-relative transition-hover">
        {/* Badge Destacado */}
        <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 shadow-sm z-1">
          ★ Destacado
        </span>

        {/* Imagen con contenedor de aspecto fijo */}
        <div className="position-relative overflow-hidden p-3 bg-white" style={{ height: "230px" }}>
          <img
            src={resolverURL(producto.imagenes?.[0])}
            alt={producto.nombre}
            className="w-100 h-100 object-fit-contain transition-scale"
            onError={(e) => (e.target.src = `${HOST}/img/placeholder.jpg`)}
          />
        </div>

        <div className="card-body d-flex flex-column text-center">
          <h6 className="fw-bold text-dark text-truncate" title={producto.nombre}>
            {producto.nombre}
          </h6>

          <p className="fs-5 fw-bold text-primary mb-3">
            ${producto.precio.toLocaleString("es-CL")}
          </p>

          <div className="mt-auto d-flex justify-content-center gap-2">
            <Link
              to={`/producto/${producto.id}`}
              className="btn btn-outline-secondary btn-sm px-3"
            >
              Ver
            </Link>
            <button
              className="btn btn-dark btn-sm px-3 d-flex align-items-center gap-1"
              onClick={() => onAddToCart(producto)}
            >
              <span>🛒</span> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL: ProductSection
// ==========================================
export default function ProductSection() {
  const { agregarAlCarrito } = useContext(CartContext);
  const { isLogged } = useContext(AuthContext);
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const MAX_PRODUCTOS_DESTACADOS = 4;

  useEffect(() => {
    let isMounted = true; // Evitar set state si el componente se desmonta

    const fetchDestacados = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/productos`);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        
        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          // Filtrar y desordenar
          const destacados = data
            .filter((p) => p.stock > 0)
            .sort(() => 0.5 - Math.random()) // Shuffle simple
            .slice(0, MAX_PRODUCTOS_DESTACADOS);
          
          setProductos(destacados);
        }
      } catch (err) {
        console.error("Error cargando destacados:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    fetchDestacados();

    return () => { isMounted = false; };
  }, []);

  const handleAgregarCarrito = (producto) => {
    if (!isLogged()) {
      // RECOMENDACIÓN: Usar Toast (ej. React-Hot-Toast) en lugar de alert
      // toast.error("Inicia sesión para comprar");
      const confirmar = window.confirm("🔒 Inicia sesión para agregar productos. ¿Ir al login?");
      if (confirmar) navigate("/login");
      return;
    }
    agregarAlCarrito(producto);
    // toast.success("Producto agregado");
  };

  // Renderizado Condicional
  if (cargando) return <LoadingSpinner />;
  if (error) return <ErrorState />;
  if (productos.length === 0) return <EmptyState />;

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Nuestros Favoritos</h2>
      
      <div className="row g-4">
        {productos.map((p) => (
          <ProductCard 
            key={p.id} 
            producto={p} 
            onAddToCart={handleAgregarCarrito} 
          />
        ))}
      </div>

      <div className="text-center mt-5">
        <Link
          to="/productos"
          className="btn btn-outline-primary px-5 rounded-pill shadow-sm"
        >
          Ver todo el catálogo →
        </Link>
      </div>

      {/* Estilos en línea para demostración (idealmente mover a CSS) */}
      <style>{`
        .transition-hover:hover { transform: translateY(-5px); }
        .transition-hover { transition: transform 0.3s ease; }
        .object-fit-contain { object-fit: contain; }
      `}</style>
    </section>
  );
}

// Pequeños componentes auxiliares para limpiar el render principal
const LoadingSpinner = () => (
  <div className="container my-5 text-center py-5">
    <div className="spinner-border text-primary" role="status"></div>
    <p className="mt-2 text-muted animate-pulse">Buscando las mejores ofertas...</p>
  </div>
);

const ErrorState = () => (
  <div className="text-center py-5 text-danger">
    <p>⚠️ Hubo un problema al cargar los productos.</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-5">
    <p className="text-muted">No hay productos destacados disponibles por ahora.</p>
  </div>
);