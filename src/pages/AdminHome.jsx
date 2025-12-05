import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

import {
  Users,
  ShoppingBag,
  DollarSign,
  FileText,
  RefreshCw,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

/* ======================================================
   🎨 PALETA ZENTRO
   ====================================================== */

const zentro = {
  primary: "#00AEEF",
  primaryRGB: "0,174,239",
  dark: "#003459",
  soft: "rgba(0,174,239,0.15)",
  softBg: "#F4FAFF",
  textGray: "#7d8a99",
};


/* ======================================================
   🧁 TARJETA DE ESTADÍSTICAS
   ====================================================== */

const StatCard = ({ title, value, subtitle, icon: Icon, loading }) => (
  <div className="col-md-4 mb-4">
    <div
      className="card shadow-sm h-100 border-0"
      style={{
        borderLeft: `6px solid ${zentro.primary}`,
        borderRadius: "14px",
        background: "#FFF",
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <small className="fw-bold text-uppercase" style={{ color: zentro.dark }}>
            {title}
          </small>

          <h2 className="fw-bold mt-1" style={{ color: zentro.dark }}>
            {loading ? (
              <div className="spinner-grow spinner-grow-sm text-secondary"></div>
            ) : (
              value
            )}
          </h2>

          <small className="text-muted">{subtitle}</small>
        </div>

        <div
          className="p-3 rounded-circle"
          style={{
            background: zentro.soft,
            color: zentro.primary,
          }}
        >
          <Icon size={36} strokeWidth={1.6} />
        </div>
      </div>
    </div>
  </div>
);


/* ======================================================
   ⚡ ACCIONES RÁPIDAS
   ====================================================== */
const ActionCard = ({ title, description, icon: Icon, link }) => (
  <div className="col-md-3 mb-3">
    <div
      className="card h-100 border-0 shadow-sm hover-scale"
      style={{
        borderRadius: "14px",
        background: "#FFF",
        paddingTop: "20px",
      }}
    >
      <div className="card-body text-center d-flex flex-column align-items-center">

        {/* Ícono círculo perfecto */}
        <div
          style={{
            width: "90px",
            height: "90px",
            background: zentro.soft,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px",
            color: zentro.primary,
          }}
        >
          <Icon size={40} strokeWidth={1.5} />
        </div>

        {/* Título */}
        <h5
          className="fw-bold mb-1"
          style={{ color: zentro.dark }}
        >
          {title}
        </h5>

        {/* Subtítulo */}
        <p className="text-muted small mb-3">{description}</p>

        {/* Botón */}
        <Link
          to={link}
          className="btn fw-bold w-100 mt-auto"
          style={{
            border: `1px solid ${zentro.primary}`,
            color: zentro.primary,
            borderRadius: "10px",
          }}
        >
          Ir <ArrowRight size={14} className="ms-1" />
        </Link>

      </div>
    </div>
  </div>
);


/* ======================================================
   🔗 BACKEND URL
   ====================================================== */

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


/* ======================================================
   🧠 ADMIN HOME
   ====================================================== */

export default function AdminHome() {
  const { token, usuario, logout } = useContext(AuthContext);

  const [stats, setStats] = useState({
    usuarios: [],
    productos: [],
    ventas: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);

  /* ======================================================
     📡 CARGAR DATOS
     ====================================================== */
  const cargarDatos = async (manual = false) => {
    if (!token) return;

    if (manual) setRefreshing(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resUsers, resProd, resVentas] = await Promise.all([
        fetch(`${BACKEND_URL}/usuarios`, { headers }),
        fetch(`${BACKEND_URL}/productos`, { headers }),
        fetch(`${BACKEND_URL}/ventas`, { headers }),
      ]);

      if (resUsers.status === 401) return logout();

      setStats({
        usuarios: (await resUsers.json()) || [],
        productos: (await resProd.json()) || [],
        ventas: (await resVentas.json()) || [],
      });
    } catch (e) {
      console.error("Error al cargar dashboard:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 15000);
    return () => clearInterval(interval);
  }, [token]);


  /* ======================================================
     📊 CÁLCULOS
     ====================================================== */

  const totalVentas = stats.ventas.reduce(
    (sum, v) => sum + Number(v.total || 0),
    0
  );

  const ventasRecientes = [...stats.ventas]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 3);


  /* ======================================================
     🎨 RENDER
     ====================================================== */

  return (
    <div
      className="container-fluid min-vh-100 p-4"
      style={{ background: zentro.softBg }}
    >

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: zentro.dark }}>
            Hola, {usuario?.nombre || "Administrador"} 👋
          </h2>
          <p className="text-muted mb-0">
            Resumen general de tu plataforma.
          </p>
        </div>

        <button
          className="btn fw-bold d-flex align-items-center gap-2 px-3"
          onClick={() => cargarDatos(true)}
          style={{
            background: "#fff",
            border: `1px solid ${zentro.primary}`,
            color: zentro.primary,
            borderRadius: "10px",
          }}
        >
          <RefreshCw
            size={18}
            className={refreshing ? "spin-animation" : ""}
          />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>


      {/* TARJETAS PRINCIPALES */}
      <div className="row mb-4">
        <StatCard
          title="Ingresos Totales"
          value={`$${totalVentas.toLocaleString("es-CL")}`}
          subtitle={`${stats.ventas.length} ventas`}
          icon={DollarSign}
          loading={loading}
        />

        <StatCard
          title="Usuarios"
          value={stats.usuarios.length}
          subtitle="Registrados"
          icon={Users}
          loading={loading}
        />

        <StatCard
          title="Productos"
          value={stats.productos.length}
          subtitle="Inventario activo"
          icon={ShoppingBag}
          loading={loading}
        />
      </div>


      {/* ACCIONES + ÚLTIMAS VENTAS */}
      <div className="row g-4">

        {/* ACCIONES RÁPIDAS */}
        <div className="col-lg-8">
          <h5 className="fw-bold text-muted mb-3">Gestión Rápida</h5>

          <div className="row g-3">
            <ActionCard
              title="Productos"
              description="Inventario"
              icon={ShoppingBag}
              link="/admin/productos"
              color="primary"
            />
            <ActionCard
              title="Usuarios"
              description="Clientes & roles"
              icon={Users}
              link="/admin/usuarios"
            />
            <ActionCard
              title="Ventas"
              description="Registro de transacciones"
              icon={TrendingUp}
              link="/admin/ventas"
            />
            <ActionCard
              title="Blog"
              description="Publicaciones & noticias"
              icon={FileText}
              link="/admin/blogs"
            />
          </div>
        </div>


        {/* ÚLTIMAS VENTAS */}
        <div className="col-lg-4">
          <h5 className="fw-bold text-muted mb-3">Últimas Ventas</h5>

          <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
            <div className="card-body p-0">

              {loading ? (
                <div className="text-center py-4 text-muted">Cargando...</div>
              ) : ventasRecientes.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No hay ventas recientes.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {ventasRecientes.map((venta) => (
                    <div
                      key={venta.id}
                      className="list-group-item d-flex justify-content-between align-items-center py-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="p-2 rounded-circle"
                          style={{
                            background: "rgba(25, 135, 84, 0.12)",
                            color: "#198754",
                          }}
                        >
                          <DollarSign size={16} />
                        </div>

                        <div>
                          <p className="fw-semibold text-dark mb-0 small">
                            Venta #{venta.id}
                          </p>
                          <small className="text-muted">
                            {new Date(venta.fecha).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      <span className="fw-bold text-success small">
                        ${Number(venta.total).toLocaleString("es-CL")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {ventasRecientes.length > 0 && (
              <div className="card-footer bg-white text-center">
                <Link className="fw-bold" style={{ color: zentro.primary }} to="/admin/ventas">
                  Ver todas →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ANIMACIONES */}
      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0); }
          to   { transform: rotate(360deg); }
        }
        .hover-scale {
          transition: 0.25s ease;
        }
        .hover-scale:hover {
          transform: translateY(-4px);
          box-shadow: 0 0.8rem 1.6rem rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
