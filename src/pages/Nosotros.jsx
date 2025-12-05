import React, { useState } from "react";

// ==========================================
// DATOS DEL EQUIPO
// ==========================================
const TEAM_MEMBERS = [
  {
    name: "Demis Zuñiga",
    role: "Desarrollador Full Stack",
    email: "dem.zuniga@duocuc.cl",
    initials: "DZ",
    color: "primary",
  },
  {
    name: "Gabriel Colmenares",
    role: "Desarrollador Backend",
    email: "ga.colmenares@duocuc.cl",
    initials: "GC",
    color: "success",
  },
  {
    name: "José Tapia",
    role: "Desarrollador Frontend",
    email: "jn.tapia@duocuc.cl",
    initials: "JT",
    color: "warning",
    textColor: "text-dark",
  },
];

// ==========================================
// SUB-COMPONENTE: Fila del Integrante
// ==========================================
const MemberRow = ({ member }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(member.email);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-center py-4 border-bottom member-row">

      {/* Avatar + Info */}
      <div className="d-flex align-items-center mb-3 mb-sm-0">
        <div
          className={`bg-${member.color} ${member.textColor || "text-white"} avatar-circle shadow-sm me-3`}
        >
          {member.initials}
        </div>

        <div>
          <h6 className="mb-0 fw-bold text-dark">{member.name}</h6>
          <small className="text-muted d-block">{member.role}</small>
          <small className="text-primary d-sm-none">{member.email}</small>
        </div>
      </div>

      {/* Botones */}
      <div className="d-flex gap-2">
        <button
          onClick={handleCopy}
          className="btn btn-light btn-sm rounded-pill px-3 border"
        >
          {copiado ? "✅ Copiado" : "📋 Copiar"}
        </button>

        <a
          href={`mailto:${member.email}`}
          className={`btn btn-outline-${member.color === "warning" ? "dark" : member.color} btn-sm rounded-pill px-3`}
        >
          📧 Enviar
        </a>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Nosotros() {
  return (
    <div className="container my-5">

      {/* Encabezado */}
      <div className="text-center mb-5 animate-fade-in">
        <h2 className="fw-bold display-5 text-dark">🏢 Sobre Nosotros</h2>

        <p className="lead text-secondary mx-auto" style={{ maxWidth: "700px" }}>
          Somos un equipo apasionado de desarrolladores que creó{" "}
          <strong className="text-primary">Zentro E-commerce</strong> para demostrar el poder
          y la eficiencia de las arquitecturas Cloud modernas.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="card shadow-lg border-0 overflow-hidden rounded-4">

            {/* Header */}
            <div className="card-header bg-primary text-white py-4 text-center">
              <h5 className="mb-0 fw-bold">👨‍💻 Nuestro Equipo</h5>
              <p className="small text-white-50 mb-0 mt-1">Las mentes detrás del proyecto</p>
            </div>

            {/* Lista */}
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {TEAM_MEMBERS.map((member) => (
                  <MemberRow key={member.email} member={member} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer text-center text-muted bg-light py-3 border-top-0">
              <small>© {new Date().getFullYear()} Proyecto Académico Duoc UC</small>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style>{`
        .avatar-circle {
          width: 55px;
          height: 55px;
          font-size: 1.25rem;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .member-row {
          transition: background-color 0.25s, transform 0.25s;
        }

        .member-row:hover {
          background-color: #f8f9fa;
          transform: translateX(4px);
        }

        .member-row:hover .avatar-circle {
          transform: scale(1.12);
        }

        .animate-fade-in {
          animation: fadeInUp 0.7s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
