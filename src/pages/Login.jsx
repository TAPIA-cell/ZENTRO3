import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const resultado = await login(email, password);

    if (resultado.ok) {
      navigate("/");
    } else {
      alert("Error: " + (resultado.msg || "Credenciales incorrectas"));
    }

    setLoading(false);
  };

  return (
    <main
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "90vh", background: "#f1f4f9" }}
    >
      <div
        className="shadow-lg rounded-4 bg-white p-4 p-md-5 animate-card"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src="/img/logo.png"
            alt="Logo Empresa"
            style={{ width: "110px" }}
            className="mb-2"
          />
        </div>

        <h3 className="fw-bold text-center mb-4">Iniciar Sesión</h3>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label text-muted fw-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="form-control py-2 bg-light"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label htmlFor="password" className="form-label text-muted fw-semibold">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control py-2 bg-light"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 rounded-pill shadow-sm"
            disabled={loading}
            style={{ fontSize: "1rem" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Ingresando...
              </>
            ) : (
              "INGRESAR"
            )}
          </button>

          <hr className="my-4" />

          <p className="text-center text-muted">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="fw-bold text-primary">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>

      {/* Estilos extra */}
      <style>{`
        .animate-card {
          animation: fadeZoom 0.5s ease;
        }

        @keyframes fadeZoom {
          from { opacity: 0; transform: scale(.95); }
          to   { opacity: 1; transform: scale(1); }
        }

        .btn-primary {
          background-color: #0d6efd;
          border: none;
        }
        .btn-primary:hover {
          background-color: #0b5ed7;
        }
      `}</style>
    </main>
  );
}
