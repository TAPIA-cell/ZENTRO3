import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const { cantidadTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCloseMenu = () => {
    const menuToggle = document.getElementById("menu");
    if (menuToggle && menuToggle.classList.contains("show")) {
      menuToggle.classList.remove("show");
    }
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom sticky-top zentro-nav">
      <div className="container">

        {/* LOGO */}
        <Link 
          className="navbar-brand fw-bold d-flex align-items-center gap-2 logo-zen"
          to="/" 
          onClick={handleCloseMenu}
        >
          <img
            src="/img/logo.png"
            alt="Logo Zentro"
            width="42"
            height="42"
            className="rounded object-fit-contain shadow-sm"
          />
          <span className="fw-bold text-primary">Zentro</span>
        </Link>

        {/* HAMBURGUESA */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ */}
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold">
            {["Inicio", "Productos", "Nosotros", "Blogs", "Contacto"].map((item) => {
              const path = item === "Inicio" ? "/" : `/${item.toLowerCase()}`;

              return (
                <li className="nav-item px-2" key={item}>
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link zentro-link " + (isActive ? "active-zen" : "")
                    }
                    to={path}
                    onClick={handleCloseMenu}
                    end={item === "Inicio"}
                  >
                    {item}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* USUARIO + CARRITO */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">

            {/* CARRITO */}
            <Link
              to="/carrito"
              className="btn btn-outline-primary position-relative px-3 py-2 carrito-btn"
              onClick={handleCloseMenu}
            >
              🛒
              {cantidadTotal > 0 && (
                <span className="badge bg-danger rounded-pill carrito-badge">
                  {cantidadTotal}
                </span>
              )}
            </Link>

            <div className="vr d-none d-lg-block mx-1"></div>

            {/* NO LOGEADO */}
            {!usuario ? (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm px-3 rounded-pill"
                  onClick={handleCloseMenu}
                >
                  Ingresar
                </Link>

                <Link
                  to="/registro"
                  className="btn btn-primary btn-sm px-3 rounded-pill text-white"
                  onClick={handleCloseMenu}
                >
                  Registrarme
                </Link>
              </div>
            ) : (
              /* DROPDOWN USUARIO */
              <div className="dropdown">
                <button
                  className="btn border-0 dropdown-toggle d-flex align-items-center gap-2 user-btn"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <div className="rounded-circle user-avatar">
                    {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="d-none d-lg-inline small fw-bold text-dark">
                    {usuario.nombre}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                  <li>
                    <Link className="dropdown-item py-2" to="/perfil" onClick={handleCloseMenu}>
                      👤 Mi Perfil
                    </Link>
                  </li>

                  {usuario.rol === "Admin" && (
                    <li>
                      <Link className="dropdown-item py-2 text-warning fw-bold" to="/admin">
                        ⚡ Panel Admin
                      </Link>
                    </li>
                  )}

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      🚪 Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ESTILOS EXTRA */}
      <style>{`
        .zentro-nav { backdrop-filter: blur(6px); }

        .zentro-link {
          color: #212529;
          transition: all .25s ease;
          position: relative;
        }
        .zentro-link:hover {
          color: #0d6efd;
          transform: translateY(-1px);
        }

        .active-zen {
          color: #0d6efd !important;
          font-weight: bold;
        }

        /* Botón carrito */
        .carrito-btn { border-radius: 12px; transition: .2s; }
        .carrito-btn:hover { transform: scale(1.05); }

        .carrito-badge {
          position: absolute;
          top: -5px;
          right: -10px;
          font-size: .7rem;
          border: 2px solid white;
        }

        /* Avatar */
        .user-avatar {
          width: 32px;
          height: 32px;
          background: #0d6efd;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 14px;
        }

        .user-btn:hover { opacity: .85; }

      `}</style>
    </nav>
  );
}

export default Navbar;
