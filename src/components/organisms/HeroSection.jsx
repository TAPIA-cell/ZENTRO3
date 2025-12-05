import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section
      className="py-5 hero-section"
      style={{
        background: "linear-gradient(to right, #f8f9fa, #eef1f5)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* TEXTO */}
          <div className="col-md-6 order-2 order-md-1 mt-4 mt-md-0 fade-in-left">
            <h1 className="fw-bold display-4 text-dark">
              Eleva tu colección con <span className="text-primary">Zentro</span>
            </h1>

            <p className="lead text-secondary my-4">
              Figuras, katanas y coleccionables de alta calidad.  
              Productos seleccionados con atención al detalle y envío rápido a todo Chile.
            </p>

            <Link
              to="/productos"
              className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-lg hero-btn"
            >
              📦 Ver Catálogo
            </Link>
          </div>

          {/* IMAGEN */}
          <div className="col-md-6 text-center order-1 order-md-2 fade-in-right">
            <div className="hero-img-wrapper">
              <img
                src="/img/Comercio.jpg"
                alt="Imagen tienda online"
                className="img-fluid rounded-4"
                style={{
                  maxHeight: "420px",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ESTILOS EXTRA */}
      <style>{`
        .hero-img-wrapper {
          padding: 8px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .hero-btn {
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
        }

        /* Animaciones */
        .fade-in-left {
          animation: fadeLeft .7s ease both;
        }
        .fade-in-right {
          animation: fadeRight .7s ease both;
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-25px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(25px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
