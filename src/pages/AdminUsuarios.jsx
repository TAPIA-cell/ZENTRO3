import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/* ======================================================
   🎨 PALETA ZENTRO
   ====================================================== */
const zentro = {
  primary: "#00AEEF",
  dark: "#003459",
  softBg: "#F4FAFF",
  fieldBg: "#f8f9fb",
  borderLight: "#d8dce2",
};

export default function AdminUsuarios() {
  const { token } = useContext(AuthContext);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [usuarios, setUsuarios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [usuarioActual, setUsuarioActual] = useState({
    id: null,
    nombre: "",
    email: "",
    rol: "Cliente",
    password: "",
  });

  /* ======================================================
     📥 Cargar usuarios
     ====================================================== */
  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    if (token) cargarUsuarios();
  }, [token]);

  /* ======================================================
     ➕ Agregar
     ====================================================== */
  const handleAgregar = async (e) => {
    e.preventDefault();

    if (!usuarioActual.nombre || !usuarioActual.email || !usuarioActual.password) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioActual),
      });

      if (res.ok) {
        alert("✔ Usuario creado");
        limpiarFormulario();
        cargarUsuarios();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ======================================================
     ✏️ Actualizar
     ====================================================== */
  const handleActualizar = async (e) => {
    e.preventDefault();

    const body = { ...usuarioActual };
    if (usuarioActual.password === "") delete body.password;

    try {
      const res = await fetch(`${BACKEND_URL}/usuarios/${usuarioActual.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✔ Usuario actualizado");
        limpiarFormulario();
        cargarUsuarios();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ======================================================
     🗑 Eliminar
     ====================================================== */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) cargarUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  /* ======================================================
     ✏️ Editar usuario
     ====================================================== */
  const handleEditar = (u) => {
    setModoEdicion(true);
    setUsuarioActual({ ...u, password: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioActual({ ...usuarioActual, [name]: value });
  };

  const limpiarFormulario = () => {
    setModoEdicion(false);
    setUsuarioActual({
      id: null,
      nombre: "",
      email: "",
      rol: "Cliente",
      password: "",
    });
  };

  /* ======================================================
     🎨 RENDER
     ====================================================== */
  return (
    <div
      className="container py-4"
      style={{
        background: zentro.softBg,
        minHeight: "100vh",
        borderRadius: "14px",
      }}
    >
      <h2 className="fw-bold mb-4" style={{ color: zentro.dark }}>
        👥 Gestión de Usuarios
      </h2>

      {/* FORM */}
      <form
        onSubmit={modoEdicion ? handleActualizar : handleAgregar}
        className="p-4 rounded shadow-sm mb-4"
        style={{
          background: "#fff",
          borderLeft: `6px solid ${zentro.primary}`,
        }}
      >
        <h4 className="fw-bold mb-3" style={{ color: zentro.dark }}>
          {modoEdicion ? "✏ Editar Usuario" : "✨ Nuevo Usuario"}
        </h4>

        <div className="row g-3">

          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={usuarioActual.nombre}
              onChange={handleChange}
              className="form-control shadow-sm"
              style={{
                background: zentro.fieldBg,
                borderColor: zentro.borderLight,
              }}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={usuarioActual.email}
              onChange={handleChange}
              className="form-control shadow-sm"
              style={{
                background: zentro.fieldBg,
                borderColor: zentro.borderLight,
              }}
              required
            />
          </div>

          <div className="col-md-2">
            <select
              name="rol"
              value={usuarioActual.rol}
              onChange={handleChange}
              className="form-select shadow-sm"
              style={{
                background: zentro.fieldBg,
                borderColor: zentro.borderLight,
              }}
            >
              <option value="Cliente">Cliente</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="password"
              name="password"
              placeholder={modoEdicion ? "(Opcional)" : "Contraseña"}
              value={usuarioActual.password}
              onChange={handleChange}
              className="form-control shadow-sm"
              style={{
                background: zentro.fieldBg,
                borderColor: zentro.borderLight,
              }}
              required={!modoEdicion}
            />
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button
              className="btn fw-bold w-100"
              style={{ background: zentro.primary, color: "white" }}
            >
              {modoEdicion ? "Guardar" : "Agregar"}
            </button>

            {modoEdicion && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="btn btn-outline-secondary"
              >
                ✖
              </button>
            )}
          </div>
        </div>
      </form>

      {/* TABLA */}
      <div className="card shadow-sm border-0">
        <div
          className="card-header fw-bold text-white"
          style={{
            background: zentro.dark,
            borderBottom: "1px solid #0a2b66",
          }}
        >
          Usuarios Registrados
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: "#eef1f6" }}>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="fw-semibold">{u.nombre}</td>
                    <td className="text-primary">{u.email}</td>
                    <td>
                      <span
                        className="badge px-3 py-2"
                        style={{
                          background: u.rol === "Admin" ? zentro.primary : "#6c757d",
                          color: "white",
                          borderRadius: "8px",
                        }}
                      >
                        {u.rol}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditar(u)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminar(u.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
