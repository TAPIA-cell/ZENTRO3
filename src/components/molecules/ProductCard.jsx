import { Link } from "react-router-dom";

function ProductCard({ producto, agregarAlCarrito }) {
  const hayStock = producto.stock > 0;

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 position-relative product-card overflow-hidden">

      {/* CINTA AGOTADO */}
      {!hayStock && (
        <div className="ribbon-wrapper">
          <span className="ribbon">AGOTADO</span>
        </div>
      )}

      {/* IMAGEN */}
      <div className="product-img-container bg-white">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={`product-img ${!hayStock ? "img-disabled" : ""}`}
          onError={(e) => (e.target.src = "/img/placeholder.jpg")}
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="card-body text-center d-flex flex-column">
        <h6 className="fw-bold text-truncate mb-2" title={producto.nombre}>
          {producto.nombre}
        </h6>

        <p className="text-primary fw-bold fs-5 mb-2">
          ${Number(producto.precio).toLocaleString("es-CL")}
        </p>

        <p className="text-muted small">{producto.descripcion}</p>

        <div className="mt-auto d-flex justify-content-center gap-2">
          <button
            className={`btn btn-sm rounded-pill px-3 ${
              hayStock ? "btn-dark" : "btn-light text-muted"
            }`}
            disabled={!hayStock}
            onClick={() => agregarAlCarrito(producto)}
          >
            {hayStock ? "🛒 Añadir" : "Sin stock"}
          </button>

          <Link
            to={`/producto/${producto.id}`}
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
          >
            Ver
          </Link>
        </div>
      </div>

      {/* ESTILOS */}
      <style>{`
        .product-img-container {
          height: 210px;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .img-disabled {
          opacity: .6;
          filter: grayscale(90%);
        }

        /* Ribbon AGOTADO */
        .ribbon-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          overflow: hidden;
          width: 110px;
          height: 110px;
          z-index: 15;
          pointer-events: none;
        }

        .ribbon {
          font-size: 0.75rem;
          font-weight: bold;
          color: #fff;
          text-align: center;
          transform: rotate(45deg);
          position: absolute;
          top: 10px;
          right: -35px;
          padding: 6px 0;
          width: 130px;
          background: #dc3545;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
