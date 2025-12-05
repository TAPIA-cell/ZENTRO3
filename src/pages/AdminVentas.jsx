import { useEffect, useState, useContext } from "react";
import * as XLSX from "xlsx";
import { AuthContext } from "../context/AuthContext";

// ==========================================
// ICONOS SVG
// ==========================================
const Icons = {
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

export default function AdminVentas() {
  const { token } = useContext(AuthContext);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000/api";

  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  // ======================================
  // ESTADO PARA PAGINACIÓN MANUAL
  // ======================================
  const [pagina, setPagina] = useState(0);
  const POR_PAGINA = 7;

  const ventasMostradas = ventas
    .filter((v) =>
      v.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.id.toString().includes(busqueda)
    )
    .slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA);

  const maxPaginas = Math.ceil(
    ventas.filter((v) =>
      v.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.id.toString().includes(busqueda)
    ).length / POR_PAGINA
  );

  // ======================================
  // Cargar ventas
  // ======================================
  const cargarVentas = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/ventas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener ventas");

      const data = await res.json();
      setVentas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [token]);

  // SI CAMBIO BÚSQUEDA, PÁGINA VUELVE A 0
  useEffect(() => {
    setPagina(0);
  }, [busqueda, ventas.length]);

  // ======================================
  // VER DETALLE
  // ======================================
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const verDetalle = async (venta) => {
    setVentaSeleccionada(venta);
    setCargandoDetalle(true);

    try {
      const res = await fetch(`${BACKEND_URL}/ventas/${venta.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setDetalleVenta(Array.isArray(data.detalle) ? data.detalle : []);
    } catch (error) {
      console.error("Error:", error);
      setDetalleVenta([]);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cerrarModal = () => setVentaSeleccionada(null);

  // ======================================
  // EXPORTAR EXCEL
  // ======================================
  const exportarVentas = async () => {
    const filtradas = ventas.filter((v) =>
      v.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.id.toString().includes(busqueda)
    );

    if (filtradas.length === 0) return alert("No hay ventas.");

    const filasExcel = [];

    for (const venta of filtradas) {
      const res = await fetch(`${BACKEND_URL}/ventas/${venta.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const detalles = Array.isArray(data.detalle) ? data.detalle : [];

      if (detalles.length === 0) {
        filasExcel.push({
          ID: venta.id,
          Fecha: new Date(venta.fecha).toLocaleString(),
          Cliente: venta.usuario,
          TotalVenta: venta.total,
          Producto: "(sin productos)",
          Cantidad: "-",
          PrecioUnitario: "-",
          SubtotalProducto: "-"
        });
        continue;
      }

      detalles.forEach((item) => {
        filasExcel.push({
          ID: venta.id,
          Fecha: new Date(venta.fecha).toLocaleString(),
          Cliente: venta.usuario,
          TotalVenta: venta.total,
          Producto: item.nombre,
          Cantidad: item.cantidad,
          PrecioUnitario: (item.subtotal / item.cantidad).toLocaleString("es-CL"),
          SubtotalProducto: item.subtotal.toLocaleString("es-CL"),
        });
      });
    }

    const ws = XLSX.utils.json_to_sheet(filasExcel);
    ws["!cols"] = Object.keys(filasExcel[0]).map(() => ({ wch: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");

    XLSX.writeFile(
      wb,
      `Reporte_Ventas_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ======================================
  // RENDER PRINCIPAL
  // ======================================
  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>

      {/* TITULO */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">🧾 Historial de Ventas</h2>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={exportarVentas}
        >
          <Icons.Download /> Exportar Excel
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-0">
          <div className="input-group" style={{ maxWidth: "420px" }}>
            <span className="input-group-text bg-light border-end-0">
              <Icons.Search />
            </span>
            <input
              type="text"
              className="form-control border-start-0 bg-light"
              placeholder="Buscar por cliente o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA */}
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="text-muted">Cargando ventas...</p>
            </div>
          ) : ventasMostradas.length === 0 ? (
            <div className="text-center py-5 text-muted">No se encontraron ventas.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-white border-bottom">
                    <tr>
                      <th className="ps-4 fw-semibold text-secondary">ID</th>
                      <th className="fw-semibold text-secondary">Fecha</th>
                      <th className="fw-semibold text-secondary">Cliente</th>
                      <th className="fw-semibold text-secondary text-end">Total</th>
                      <th className="fw-semibold text-secondary text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ventasMostradas.map((v) => (
                      <tr key={v.id} className="align-middle">
                        <td className="ps-4 fw-bold text-dark">#{v.id}</td>
                        <td>
                          <div className="fw-semibold text-dark">
                            {new Date(v.fecha).toLocaleDateString()}
                          </div>
                          <div className="text-muted small">
                            {new Date(v.fecha).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td>
                          <span className="badge px-3 py-2 rounded-pill text-white" style={{ backgroundColor: "#0d6efd" }}>
                            {v.usuario || "Anónimo"}
                          </span>
                        </td>
                        <td className="text-end fw-bold text-success">
                          ${Number(v.total).toLocaleString("es-CL")}
                        </td>
                        <td className="text-center">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => verDetalle(v)}>
                            <Icons.Eye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BOTONES SIGUIENTE / ANTERIOR */}
              <div className="d-flex justify-content-between align-items-center p-3 bg-white border-top">
                
                <button
                  className="btn btn-outline-secondary"
                  disabled={pagina === 0}
                  onClick={() => setPagina(pagina - 1)}
                >
                  ← Anterior
                </button>

                <span className="text-muted small">
                  Página {pagina + 1} de {maxPaginas}
                </span>

                <button
                  className="btn btn-outline-primary"
                  disabled={pagina + 1 >= maxPaginas}
                  onClick={() => setPagina(pagina + 1)}
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL DETALLE */}
      {ventaSeleccionada && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">

              <div className="modal-header text-white" style={{ backgroundColor: "#0d6efd" }}>
                <h5 className="modal-title fw-bold">Ticket #{ventaSeleccionada.id}</h5>
                <button className="btn text-white" onClick={cerrarModal}>
                  <Icons.Close />
                </button>
              </div>

              <div className="modal-body p-4">
                {cargandoDetalle ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  <>
                    <h6 className="fw-bold mb-3">Productos de la Venta</h6>

                    {detalleVenta.length === 0 ? (
                      <p className="text-muted">No hay detalles disponibles.</p>
                    ) : (
                      <ul className="list-group">
                        {detalleVenta.map((item, i) => (
                          <li key={i} className="list-group-item d-flex justify-content-between">
                            <span>{item.nombre} (x{item.cantidad})</span>
                            <strong>${item.subtotal.toLocaleString("es-CL")}</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cerrar</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
