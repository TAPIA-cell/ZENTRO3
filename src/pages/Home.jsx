import HeroSection from "../components/organisms/HeroSection";
import ProductSection from "../components/organisms/ProductSection";

export default function Home() {
  return (
    <main className="min-vh-100 d-flex flex-column">

      {/* ====================== */}
      {/* 1. HERO SECTION        */}
      {/* ====================== */}
      <div className="bg-light">
        <HeroSection />
      </div>

      {/* ====================== */}
      {/* 2. BENEFICIOS          */}
      {/* ====================== */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="row g-4 text-center fade-in-up">

            {[
              { icon: "🚚", title: "Envío Rápido", desc: "Recibe tu pedido en 24/48 horas" },
              { icon: "💳", title: "Pago Seguro", desc: "Transacciones cifradas con SSL" },
              { icon: "🛡️", title: "Garantía Total", desc: "30 días para devoluciones" },
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="p-4 rounded-4 shadow-sm hover-card"
                     style={{ background: "#f8f9fc" }}>
                  
                  <div className="fs-1 mb-2">{item.icon}</div>

                  <h5 className="fw-bold text-dark">{item.title}</h5>
                  <p className="text-secondary small mt-1">{item.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* 3. PRODUCTOS DESTACADOS */}
      {/* ====================== */}
      <section className="bg-body-tertiary py-5">
        <div className="text-center mb-5 fade-in-up">
          
          {/* Badge Premium */}
          <span className="badge px-3 py-2 rounded-pill"
            style={{
              backgroundColor: "rgba(13,110,253,0.15)",
              color: "#0d6efd",
              border: "1px solid rgba(13,110,253,0.3)",
              letterSpacing: "0.5px"
            }}>
            NUEVA COLECCIÓN
          </span>

          <h2 className="fw-bold display-6 text-dark mt-3">
            🔥 Lo más vendido de la semana
          </h2>
          <p className="text-secondary">
            Descubre los favoritos de nuestros clientes
          </p>
        </div>

        <ProductSection />
      </section>

      {/* ====================== */}
      {/* 4. NEWSLETTER           */}
      {/* ====================== */}
      <section className="py-5 mt-auto text-white"
        style={{
          background: "linear-gradient(135deg, #0b0f19, #0d6efd)"
        }}>
        
        <div className="container text-center fade-in-up">
          <h3 className="fw-bold mb-2">¿No encuentras lo que buscas?</h3>

          <p className="lead opacity-75 mb-4">
            Suscríbete para recibir novedades y ofertas exclusivas.
          </p>

          <button className="btn btn-light px-4 py-2 fw-semibold rounded-pill shadow-sm">
            Recibir novedades ✉️
          </button>
        </div>
      </section>

      {/* ====================== */}
      {/* ESTILOS EXTRA          */}
      {/* ====================== */}
      <style>{`
        .fade-in-up {
          animation: fadeInUp .8s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hover-card {
          transition: transform 0.2s, box-shadow 0.3s;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>

    </main>
  );
}
