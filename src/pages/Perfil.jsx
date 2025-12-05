import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Perfil() {
  const { usuario, logout } = useContext(AuthContext);

  if (!usuario) return null;

  return (
    <div className="container my-5 fade-in">
      <div
        className="card border-0 shadow-lg mx-auto rounded-4 overflow-hidden"
        style={{ maxWidth: "620px" }}
      >
        {/* HEADER */}
        <div className="bg-primary text-white text-center p-5 position-relative">
          
          {/* Aro brillante detrás del avatar */}
          <div
            className="halo position-absolute top-50 start-50 translate-middle"
          ></div>

          {/* AVATAR PRINCIPAL */}
          <div
            className="avatar mx-auto mb-3 bg-white text-primary shadow"
            style={{
              width: "95px",
              height: "95px",
              borderRadius: "50%",
              fontSize: "2.5rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            {usuario.nombre?.charAt(0).toUpperCase() || "?"}
          </div>

          <h3 className="fw-bold mb-1">{usuario.nombre}</h3>
          <span className="badge bg-light text-primary px-3 py-2 rounded-pill shadow-sm">
            {usuario.rol}
          </span>
        </div>

        {/* CUERPO */}
        <div className="card-body p-4">
          <h5 className="text-secondary fw-bold mb-3 border-bottom pb-2">
            Datos de la Cuenta
          </h5>

          <div className="mb-4">
            <label className="fw-semibold text-muted small">
              CORREO ELECTRÓNICO
            </label>
            <p className="fs-5 text-dark m-0">{usuario.email}</p>
          </div>

          <div className="mb-4">
            <label className="fw-semibold text-muted small">
              ID DE USUARIO
            </label>
            <p className="font-monospace bg-light p-2 rounded text-muted m-0 text-break">
              {usuario.id}
            </p>
          </div>

          <button
            className="btn btn-danger w-100 py-2 fw-bold rounded-pill shadow-sm logout-btn"
            onClick={logout}
          >
            🔒 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* ESTILOS INLINE */}
      <style>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        /* Halo luminoso detrás del avatar */
        .halo {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0)
          );
          animation: pulse 3s infinite ease-in-out;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.4; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logout-btn {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .logout-btn:hover {
          transform: translateY(-2px);
          background: #c82333;
        }
      `}</style>
    </div>
  );
}

export default Perfil;
