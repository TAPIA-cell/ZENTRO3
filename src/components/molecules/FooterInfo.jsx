function FooterInfo() {
  return (
    <footer className="footer-simple border-top mt-5 py-4 text-light" style={{ backgroundColor: "#0b0d11" }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
        {/* Columna izquierda */}
        <div className="mb-3 mb-md-0">
          <span className="fw-bold text-light">Zentro E-commerce</span>
          <p className="text-secondary small mb-0">
            Tu tienda de figuras y coleccionables. Envíos a todo Chile 🇨🇱.
          </p>
        </div>

        {/* Columna derecha */}
        <div className="text-secondary small">
          © {new Date().getFullYear()} Zentro E-commerce — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default FooterInfo;
