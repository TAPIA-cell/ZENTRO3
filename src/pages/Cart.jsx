import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

function Cart() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito } =
    useContext(CartContext);

  const colors = {
    primary: "#00AEEF",
    dark: "#003459",
    gray: "#7d8a99",
    soft: "#F4FAFF",
  };

  const total = carrito.reduce(
    (sum, p) => sum + Number(p.precio || 0) * Number(p.cantidad || 1),
    0
  );

  // ========================================================
  // 🔧 Resolver URL imágenes
  // ========================================================
  const resolverURL = (img) => {
    if (!img) return "/img/placeholder.jpg";
    if (img.startsWith("http")) return img;
    return `/img/${img.replace(/^\/?img\//i, "")}`;
  };

  // ========================================================
  // ➕ SUMAR
  // ========================================================
  const sumarCantidad = (p) => {
    const nueva = Number(p.cantidad) + 1;
    if (nueva > p.stock) return alert("Stock máximo alcanzado");

    agregarAlCarrito({ id_producto: p.id, cantidad: nueva });
  };

  // ========================================================
  // ➖ RESTAR
  // ========================================================
  const restarCantidad = (p) => {
    const nueva = Number(p.cantidad) - 1;
    if (nueva < 1) return;

    agregarAlCarrito({ id_producto: p.id, cantidad: nueva });
  };

  // ========================================================
  // 🛒 Carrito vacío
  // ========================================================
  if (carrito.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-muted mb-3">🛒 Tu carrito está vacío</h3>
        <Link to="/productos" className="btn btn-primary px-4 py-2">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: "75vh" }}>
      <h2
        className="fw-bold mb-4"
        style={{
          color: colors.dark,
          borderLeft: `6px solid ${colors.primary}`,
          paddingLeft: "12px",
        }}
      >
        🛒 Carrito de Compras
      </h2>

      <div className="row g-4">
        {/* 🟦 LISTA PRODUCTOS */}
        <div className="col-md-8">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "14px", background: colors.soft }}
          >
            <div
              className="card-header fw-bold"
              style={{
                background: colors.dark,
                color: "white",
                borderTopLeftRadius: "14px",
                borderTopRightRadius: "14px",
              }}
            >
              Productos en tu carrito
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    background: "#e9eef5",
                    color: colors.dark,
                    fontWeight: "600",
                  }}
                >
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {carrito.map((p) => {
                    const cantidad = Number(p.cantidad);
                    const precio = Number(p.precio);

                    return (
                      <tr key={p.cartItemId}>
                        <td>
                          <img
                            src={resolverURL(p.imagenes?.[0])}
                            width="60"
                            height="60"
                            className="rounded shadow-sm"
                            style={{
                              objectFit: "cover",
                              background: "#fff",
                              padding: "4px",
                            }}
                          />
                        </td>

                        <td className="fw-semibold">
                          {p.nombre}
                          <br />
                          <small className="text-muted">
                            Stock disponible: {p.stock}
                          </small>
                        </td>

                        <td>${precio.toLocaleString("es-CL")}</td>

                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm btn-outline-dark me-2"
                              onClick={() => restarCantidad(p)}
                              disabled={cantidad <= 1}
                            >
                              −
                            </button>

                            <span className="fw-bold">{cantidad}</span>

                            <button
                              className="btn btn-sm btn-outline-dark ms-2"
                              onClick={() => sumarCantidad(p)}
                              disabled={cantidad >= p.stock}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="fw-bold">
                          ${(precio * cantidad).toLocaleString("es-CL")}
                        </td>

                        <td>
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => eliminarDelCarrito(p.cartItemId)}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🟩 RESUMEN */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "14px", background: "#fff" }}
          >
            <div className="card-body">
              <h4
                className="fw-bold mb-3"
                style={{ color: colors.dark, borderBottom: "1px solid #ccc" }}
              >
                Resumen de Compra
              </h4>

              <p className="d-flex justify-content-between text-muted">
                <span>Total productos:</span>
                <strong className="text-dark">{carrito.length}</strong>
              </p>

              <p className="d-flex justify-content-between">
                <span>Total a pagar:</span>
                <strong
                  className="text-success"
                  style={{ fontSize: "1.3rem" }}
                >
                  ${total.toLocaleString("es-CL")}
                </strong>
              </p>

              <div className="d-grid mt-4 gap-2">
                <button
                  className="btn btn-outline-danger fw-bold rounded-pill"
                  onClick={vaciarCarrito}
                >
                  🗑 Vaciar carrito
                </button>

                <Link
                  to="/checkout"
                  className="btn fw-bold rounded-pill"
                  style={{
                    background: colors.primary,
                    color: "white",
                  }}
                >
                  💳 Proceder al pago
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
