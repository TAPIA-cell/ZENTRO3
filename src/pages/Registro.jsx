import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Registro() {
  const { registrar } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const resultado = await registrar(nombre, correo, password);

    if (resultado.ok) {
      alert("✅ Registro exitoso. Ya puedes iniciar sesión.");
      navigate("/login");
    } else {
      setError(resultado.msg || "Ocurrió un error al registrar.");
    }

    setLoading(false);
  };

  return (
    <main className="container my-5">

      {/* CARD PRINCIPAL */}
      <div
        className="mx-auto shadow-lg p-4 rounded-4 bg-white animate-fade"
        style={{ maxWidth: "450px" }}
      >
        {/* LOGO */}
        <div className="text-center mb-3">
          <img
            src="/img/logo.png"
            alt="Logo"
            width="110"
            className="img-fluid"
            style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }}
          />
        </div>

        {/* TÍTULO */}
        <h2 className="text-center fw-bold text-dark mb-4">
          Crear Cuenta
        </h2>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="text-start">

          <div className="mb-3">
            <label htmlFor="nombre" className="form-label fw-semibold text-secondary">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control rounded-pill"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label fw-semibold text-secondary">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              className="form-control rounded-pill"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold text-secondary">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger small py-2 text-center rounded-3">
              {error}
            </div>
          )}

          {/* BOTÓN REGISTRAR */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold rounded-pill py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registrando...
              </>
            ) : (
              "REGISTRARME"
            )}
          </button>

          <hr className="my-4" />

          <p className="text-center">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>

      {/* ESTILOS LOCALES */}
      <style>{`
        .animate-fade {
          animation: fadeIn .7s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default Registro;
