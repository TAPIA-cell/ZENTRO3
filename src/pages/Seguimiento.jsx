import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

function Seguimiento() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [orden, setOrden] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // =====================================================
  // Cargar Orden por TOKEN SECRETO
  // =====================================================
  useEffect(() => {
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/ventas/track/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrada");
        return res.json();
      })
      .then((data) => setOrden(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  // =====================================================
  // Loading
  // =====================================================
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3 text-muted">Cargando comprobante...</p>
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================
  if (error) {
    return (
      <div className="container text-center py-5 fade-in">
        <h2 className="text-danger fw-bold mb-3">⛔ Acceso denegado</h2>
        <p className="text-muted mb-4">El código QR no es válido o la orden no existe.</p>
        <Link to="/" className="btn btn-primary rounded-pill px-4">
          Ir al inicio
        </Link>
      </div>
    );
  }

  // =====================================================
  // VISTA PRINCIPAL
  // =====================================================
  return (
    <div className="container py-5 fade-in">
      <div
        className="mx-auto shadow-lg border-0 rounded-4 bg-white overflow-hidden animate-card"
        style={{ maxWidth: "650px" }}
      >
        {/* ENCABEZADO */}
        <div
          className="text-center text-white py-4"
          style={{
            background: "linear-gradient(135deg, #0d6efd, #0b5ed7)",
          }}
        >
          <h3 className="fw-bold m-0">Comprobante de Compra</h3>
          <small className="text-white-50 d-block mt-1">Orden #{orden.id}</small>
        </div>

        {/* MONTO + FECHA */}
        <div className="p-4 text-center">
          <h1 className="display-5 fw-bold text-dark">
            ${Number(orden.total).toLocaleString("es-CL")}
          </h1>
          <p className="text-muted">
            {new Date(orden.fecha).toLocaleString("es-CL")}
          </p>
        </div>

        <hr className="m-0" />

        {/* PRODUCTOS */}
        <div className="p-4">
          <h5 className="fw-bold mb-3">📦 Productos Comprados</h5>

          <ul className="list-group rounded-4 overflow-hidden">
            {orden.items.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.nombre}</strong>
                  <div className="text-muted small">x{item.cantidad}</div>
                </div>
                <span className="fw-bold text-success">
                  ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CLIENTE */}
        <div className="px-4 pb-4">
          <div className="alert alert-light border rounded-3 text-center">
            <strong>Cliente:</strong> {orden.usuario}
            <br />
            <small className="text-muted">{orden.correo}</small>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center bg-light py-3 border-top">
          <Link to="/" className="btn btn-outline-dark rounded-pill px-4">
            Volver a la tienda
          </Link>
        </div>
      </div>

      {/* ESTILOS EXTRA */}
      <style>{`
        .fade-in {
          animation: fadeIn .7s ease-out;
        }

        .animate-card {
          animation: cardPop .4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardPop {
          0% { transform: scale(.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Seguimiento;
