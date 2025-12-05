import { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
// Librerías PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

function Checkout() {
  const { carrito, total, vaciarCarrito } = useContext(CartContext);
  const { token, isLogged, usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef(null);

  // URL Backend
  const BACKEND_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:3000/api";

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellido: "",
    correo: usuario?.email || "",
    calle: "",
    depto: "",
    region: "",
    comuna: "",
  });

  const [errors, setErrors] = useState({});
  const [estadoCompra, setEstadoCompra] = useState(null); // null | 'exito'
  const [procesando, setProcesando] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState(null);

  // Scroll suave al error
  useEffect(() => {
    if (Object.keys(errors).length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [errors]);

  // Manejar inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  // Helper: Resolver URL de imagen
  const resolverImagen = (img) => {
    if (!img) return "/img/placeholder.jpg";
    if (img.startsWith("http")) return img;
    return `/img/${img.replace(/^(\/?img\/)?/i, "")}`;
  };

  // =========================================================================
  // 📄 LÓGICA DE GENERACIÓN DE PDF (Ordenada y Modernizada)
  // =========================================================================
  const generarPDF = async (ventaData) => {
    const venta = ventaData || detalleCompra;
    if (!venta) return;

    const doc = new jsPDF({ format: "letter", unit: "pt" });
    
    // Configuración de Colores y Estilos
    const colorPrimario = [41, 128, 185]; // Azul corporativo
    const colorGris = [100, 100, 100];
    const margen = 40;

    // --- 1. Helper para cargar imágenes Base64 ---
    const loadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url.startsWith("http") ? url : `${window.location.origin}${url.startsWith("/")?"":"/"}${url}`;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
      });
    };

    // --- 2. Carga de Assets (Logo, QR, Productos) ---
    const logoUrl = await loadImage("/img/logo.png"); // Asegúrate de tener logo.png en public/img
    
    // Generar QR
    const PUBLIC_HOST = "http://3.208.218.72:5173"; 
    const qrUrl = await QRCode.toDataURL(`${PUBLIC_HOST}/seguimiento?token=${venta.token}`);

    // --- 3. Construcción del Documento ---
    
    // HEADER (Fondo de color)
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, 612, 120, "F"); // Barra superior azul
    
    // Logo (Sobre fondo azul)
    if (logoUrl) {
        doc.addImage(logoUrl, "PNG", margen, 30, 80, 80); // Ajusta tamaño según tu logo
    }

    // Título Empresa (Blanco)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("ZENTRO E-COMMERSE", 140, 65);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Tu tienda de confianza", 140, 80);
    doc.text("Santiago, Chile", 140, 95);

    // Info de la Boleta (Caja derecha superior)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("BOLETA ELECTRÓNICA", 570, 50, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Nº Orden: ${venta.id}`, 570, 70, { align: "right" });
    doc.text(`Fecha: ${venta.fecha.split(" ")[0]}`, 570, 85, { align: "right" });

    // DATOS DEL CLIENTE
    doc.setTextColor(0, 0, 0);
    const startYInfo = 150;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Cliente", margen, startYInfo);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margen, startYInfo + 5, 570, startYInfo + 5);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colorGris);
    
    doc.text(`Nombre:`, margen, startYInfo + 25);
    doc.setTextColor(0,0,0);
    doc.text(venta.usuario, 100, startYInfo + 25);
    
    doc.setTextColor(...colorGris);
    doc.text(`Correo:`, margen, startYInfo + 40);
    doc.setTextColor(0,0,0);
    doc.text(venta.correo, 100, startYInfo + 40);

    // TABLA DE PRODUCTOS
    const columnas = ["Item", "Precio Unit.", "Cant.", "Total"];
    const filas = venta.items.map(p => [
        p.nombre,
        `$${p.precio.toLocaleString("es-CL")}`,
        p.cantidad,
        `$${(p.precio * p.cantidad).toLocaleString("es-CL")}`
    ]);

    autoTable(doc, {
        startY: startYInfo + 60,
        head: [columnas],
        body: filas,
        theme: 'striped',
        headStyles: { fillColor: colorPrimario, textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 8 },
        columnStyles: {
            0: { cellWidth: 250 }, // Nombre ancho
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'right', fontStyle: 'bold' }
        }
    });

    // TOTALES Y PIE DE PÁGINA
    const finalY = doc.lastAutoTable.finalY + 30;

    // QR Code (Izquierda inferior de los totales)
    doc.addImage(qrUrl, "PNG", margen, finalY, 80, 80);
    doc.setFontSize(8);
    doc.setTextColor(...colorGris);
    doc.text("Escanea para ver tu pedido online", margen + 40, finalY + 90, { align: "center" });

    // Totales (Derecha)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    
    // Alineamos a la derecha usando coordenadas aproximadas (letter width ~ 612pt)
    doc.text("Total a Pagar:", 400, finalY + 20);
    doc.setFontSize(16);
    doc.setTextColor(...colorPrimario);
    doc.text(`$${venta.total.toLocaleString("es-CL")}`, 570, finalY + 20, { align: "right" });

    // Mensaje final
    doc.setFontSize(9);
    doc.setTextColor(...colorGris);
    doc.setFont("helvetica", "italic");
    doc.text("Gracias por preferir Zentro Store. Si tienes dudas contáctanos.", 306, 750, { align: "center" });

    doc.save(`Orden_${venta.id}.pdf`);
  };

  // =========================================================================
  // 💰 PROCESAR PAGO
  // =========================================================================
  const validarFormulario = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "Requerido";
    if (!form.apellido.trim()) newErrors.apellido = "Requerido";
    if (!form.correo.trim()) newErrors.correo = "Requerido";
    if (!form.calle.trim()) newErrors.calle = "Requerido";
    if (!form.region) newErrors.region = "Selecciona una opción";
    if (!form.comuna.trim()) newErrors.comuna = "Requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pagarAhora = async () => {
    if (!validarFormulario()) return;
    if (carrito.length === 0) return alert("Tu carrito está vacío");
    if (!isLogged()) { alert("Debes iniciar sesión"); navigate("/login"); return; }

    setProcesando(true);
    try {
      const itemsProcesados = carrito.map((p) => ({
        id_producto: p.id,
        cantidad: p.cantidad || 1,
        precio: p.precio,
        nombre: p.nombre,
        imagen: resolverImagen(p.imagenes?.[0]),
      }));

      const payload = {
        items: itemsProcesados,
        total,
        datosCliente: {
            nombre: `${form.nombre} ${form.apellido}`,
            correo: form.correo,
            direccion: `${form.calle} ${form.depto}, ${form.comuna}, ${form.region}`
        }
      };

      const res = await fetch(`${BACKEND_URL}/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");

      const ventaOK = {
        id: data.id,
        token: data.token,
        usuario: `${form.nombre} ${form.apellido}`,
        correo: form.correo,
        fecha: new Date().toLocaleString("es-CL"),
        items: itemsProcesados,
        total,
      };

      setDetalleCompra(ventaOK);
      setEstadoCompra("exito");
      vaciarCarrito();
      await generarPDF(ventaOK);

    } catch (error) {
      console.error(error);
      alert("Hubo un error: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const totalCL = total.toLocaleString("es-CL");

  // =========================================================================
  // 🖼️ VISTA DE ÉXITO
  // =========================================================================
  if (estadoCompra === "exito") {
    return (
      <div className="container py-5 fade-in">
        <div className="card shadow-lg border-0 rounded-4 text-center p-5">
            <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{width: '100px', height: '100px'}}>
                    <span style={{fontSize: '3rem'}}>🎉</span>
                </div>
            </div>
            <h2 className="fw-bold mb-3">¡Orden #{detalleCompra?.id} Confirmada!</h2>
            <p className="text-muted lead mb-4">
                Hemos enviado un correo con los detalles. Tu boleta se descargará automáticamente.
            </p>
            
            <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button 
                    onClick={() => generarPDF(detalleCompra)}
                    className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold"
                >
                    📥 Descargar Boleta Nuevamente
                </button>
                <Link to="/productos" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
                    🛍️ Seguir Comprando
                </Link>
            </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 📝 VISTA DE FORMULARIO (Checkout)
  // =========================================================================
  return (
    <div className="container py-5" ref={formRef}>
      <h2 className="mb-4 fw-bold text-dark">Finalizar Compra</h2>
      
      <div className="row g-5">
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div className="col-lg-7 order-2 order-lg-1">
            <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white py-3 border-bottom border-light">
                    <h5 className="m-0 fw-bold text-secondary">📍 Información de Envío</h5>
                </div>
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small text-muted fw-bold">Nombre</label>
                            <input name="nombre" className={`form-control bg-light ${errors.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={handleChange} />
                            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted fw-bold">Apellido</label>
                            <input name="apellido" className={`form-control bg-light ${errors.apellido ? 'is-invalid' : ''}`} value={form.apellido} onChange={handleChange} />
                            {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                        </div>
                        <div className="col-12">
                            <label className="form-label small text-muted fw-bold">Correo Electrónico</label>
                            <input type="email" name="correo" className={`form-control bg-light ${errors.correo ? 'is-invalid' : ''}`} value={form.correo} onChange={handleChange} />
                            {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                        </div>
                        <div className="col-md-8">
                            <label className="form-label small text-muted fw-bold">Calle y Número</label>
                            <input name="calle" className={`form-control bg-light ${errors.calle ? 'is-invalid' : ''}`} value={form.calle} onChange={handleChange} />
                            {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted fw-bold">Depto (Opcional)</label>
                            <input name="depto" className="form-control bg-light" value={form.depto} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted fw-bold">Región</label>
                            <select name="region" className={`form-select bg-light ${errors.region ? 'is-invalid' : ''}`} value={form.region} onChange={handleChange}>
                                <option value="">Selecciona...</option>
                                <option value="RM">Región Metropolitana</option>
                                <option value="V">Valparaíso</option>
                                <option value="VIII">Biobío</option>
                            </select>
                            {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted fw-bold">Comuna</label>
                            <input name="comuna" className={`form-control bg-light ${errors.comuna ? 'is-invalid' : ''}`} value={form.comuna} onChange={handleChange} />
                            {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* COLUMNA DERECHA: Resumen */}
        <div className="col-lg-5 order-1 order-lg-2">
            <div className="card shadow border-0 rounded-4 sticky-top" style={{top: '2rem'}}>
                <div className="card-header bg-primary text-white py-3 rounded-top-4">
                    <h5 className="m-0 fw-bold">Resumen del Pedido</h5>
                </div>
                <div className="card-body p-4">
                    {/* Lista Pequeña de Items */}
                    <div className="mb-4" style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {carrito.map((item) => (
                            <div key={item.id} className="d-flex gap-3 mb-3 align-items-center border-bottom pb-2">
                                <div style={{width:'50px', height:'50px', borderRadius:'8px', overflow:'hidden', flexShrink:0}}>
                                    <img src={resolverImagen(item.imagenes?.[0])} alt={item.nombre} className="w-100 h-100 object-fit-cover" />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="m-0 text-truncate" style={{maxWidth: '180px'}}>{item.nombre}</h6>
                                    <small className="text-muted">x{item.cantidad}</small>
                                </div>
                                <div className="fw-bold text-end">
                                    ${(item.precio * (item.cantidad || 1)).toLocaleString("es-CL")}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
                        <span className="h5 text-muted m-0">Total</span>
                        <span className="h3 fw-bold text-primary m-0">${totalCL}</span>
                    </div>

                    <button 
                        className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm transition-all"
                        onClick={pagarAhora}
                        disabled={procesando}
                        style={{transform: procesando ? 'scale(0.98)' : 'scale(1)'}}
                    >
                        {procesando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Procesando...
                            </>
                        ) : "💳 Pagar Ahora"}
                    </button>
                    
                    <div className="text-center mt-3">
                        <small className="text-muted">🔒 Pago 100% Seguro</small>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;