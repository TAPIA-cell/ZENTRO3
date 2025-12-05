import { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    comentario: ""
  });

  const [estado, setEstado] = useState({ type: null, msg: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ type: "loading", msg: "" });

    try {
      const res = await fetch(`${API_URL}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setEstado({ type: "success", msg: "¡Mensaje enviado correctamente! Te responderemos pronto." });
        setForm({ nombre: "", email: "", comentario: "" });

        setTimeout(() => setEstado({ type: null, msg: "" }), 5000);
      } else {
        throw new Error("Error en el servidor");
      }
    } catch (error) {
      console.error("Error envío:", error);
      setEstado({ type: "error", msg: "No pudimos enviar el mensaje. Intenta nuevamente." });
    }
  };

  return (
    <div className="container my-5 fade-in">
      <div className="row g-0 shadow-lg rounded-4 overflow-hidden">

        {/* COLUMNA IZQUIERDA – Información */}
        <div className="col-lg-5 text-white p-5 d-flex flex-column justify-content-center position-relative"
             style={{ background: "#0d6efd" }}>

          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
               style={{
                 backgroundImage: 'url(/img/pattern.png)',
                 backgroundSize: "cover"
               }}>
          </div>

          <div className="position-relative z-1">
            <h3 className="fw-bold display-6 mb-4">Contáctanos</h3>

            <p className="text-light opacity-75 mb-4">
              Estamos listos para ayudarte en cualquier consulta o duda que tengas.
            </p>

            <div className="d-flex align-items-center mb-3">
              <span className="fs-4 me-3">📧</span>
              <span className="fw-semibold">contacto@zentro.cl</span>
            </div>

            <div className="d-flex align-items-center">
              <span className="fs-4 me-3">📍</span>
              <span className="fw-semibold">Santiago, Chile</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA – Formulario */}
        <div className="col-lg-7 bg-white p-5">

          <h2 className="fw-bold text-dark mb-4">Envíanos un mensaje</h2>

          {/* Alertas */}
          {estado.type === "success" && (
            <div className="alert alert-success shadow-sm" role="alert">
              ✅ {estado.msg}
            </div>
          )}

          {estado.type === "error" && (
            <div className="alert alert-danger shadow-sm" role="alert">
              ⚠️ {estado.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Nombre */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control shadow-sm"
                id="nombreInput"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
              />
              <label htmlFor="nombreInput">Nombre Completo</label>
            </div>

            {/* Email */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control shadow-sm"
                id="emailInput"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
              />
              <label htmlFor="emailInput">Correo Electrónico</label>
            </div>

            {/* Comentario */}
            <div className="form-floating mb-4">
              <textarea
                className="form-control shadow-sm"
                id="comentarioInput"
                name="comentario"
                style={{ height: "150px" }}
                required
                value={form.comentario}
                onChange={handleChange}
              ></textarea>
              <label htmlFor="comentarioInput">¿Cómo podemos ayudarte?</label>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm transition-btn"
              disabled={estado.type === "loading"}
            >
              {estado.type === "loading" ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enviando...
                </>
              ) : (
                "Enviar Mensaje ✈️"
              )}
            </button>

          </form>
        </div>
      </div>

      {/* Animaciones y estilo */}
      <style>{`
        .fade-in { animation: fadeIn .7s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .transition-btn { transition: 0.2s ease; }
        .transition-btn:hover { transform: translateY(-2px); opacity: 0.95; }
        .transition-btn:active { transform: none; }
      `}</style>
    </div>
  );
}
