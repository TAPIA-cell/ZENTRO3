import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  // Inicializamos siempre como array vacío para evitar el error de .reduce()
  const [carrito, setCarrito] = useState([]);

  // 🔧 CONFIGURACIÓN DE IP PÚBLICA (CRUCIAL)
  // Usamos tu IP pública para que funcione en todos los dispositivos
  const BACKEND_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || "http://3.208.218.72:3000/api";
  const API = `${BACKEND_URL}/carrito`;

  // ==========================================
  // 📥 CARGAR CARRITO (CON PROTECCIÓN 401)
  // ==========================================
  const cargarCarrito = async () => {
    // Si no hay token, no intentamos cargar nada y dejamos el carrito vacío
    if (!token) {
        setCarrito([]); 
        return; 
    }

    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Si el servidor rechaza el token (401), limpiamos el carrito
      if (res.status === 401) {
        console.warn("Sesión caducada o inválida. Limpiando carrito.");
        setCarrito([]);
        return;
      }

      if (!res.ok) {
        console.warn(`Error cargando carrito (Status: ${res.status})`);
        setCarrito([]); 
        return;
      }

      const data = await res.json();
      
      // 🛡️ BLINDAJE ANTI-CAÍDAS: Verificamos que sea una lista real
      if (Array.isArray(data)) {
        setCarrito(data);
      } else {
        console.error("⚠️ La API devolvió datos incorrectos:", data);
        setCarrito([]); // Si falla, array vacío para que no explote .reduce
      }

    } catch (err) {
      console.error("❌ Error de conexión al cargar carrito:", err);
      setCarrito([]); // En error de red, aseguramos array vacío
    }
  };

  // ==========================================
  // ➕/➖ AGREGAR O ACTUALIZAR
  // ==========================================
  const agregarAlCarrito = async (datos) => {
    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        return;
    }

    try {
      let idFinal = null;
      let cantidadFinal = null;

      if (datos?.id_producto && datos?.cantidad !== undefined) {
        idFinal = datos.id_producto;
        cantidadFinal = datos.cantidad;
      }
      else if (typeof datos === "number" || typeof datos === "string") {
        idFinal = datos;
      } else if (datos?.id) {
        idFinal = datos.id;
      }

      if (!idFinal) {
        console.error("❌ Error: ID no detectado");
        return;
      }

      let res;
      if (cantidadFinal !== null) {
        res = await fetch(API, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productoId: idFinal, cantidad: cantidadFinal }),
        });
      } else {
        res = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productoId: idFinal }),
        });
      }

      if (res.status === 401) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        const mensaje = errorData.error || "Error desconocido";
        alert(`❌ No se pudo agregar: ${mensaje}`);
        return; 
      }
      
      await cargarCarrito(); 
      
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      alert("Error de conexión con el servidor.");
    }
  };

  // ==========================================
  // 🗑️ ELIMINAR
  // ==========================================
  const eliminarDelCarrito = async (id) => {
    if (!token) return;
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarCarrito();
    } catch (err) { console.error(err); }
  };

  // ==========================================
  // 💣 VACIAR
  // ==========================================
  const vaciarCarrito = async () => {
    if (!token) return;
    try {
      await fetch(`${API}/vaciar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarrito([]);
    } catch (err) { console.error(err); }
  };

  // ==========================================
  // 💰 CÁLCULOS SEGUROS
  // ==========================================
  // Aquí es donde ocurría el error. Aseguramos que siempre sea un array.
  const listaSegura = Array.isArray(carrito) ? carrito : [];

  const total = listaSegura.reduce(
    (sum, p) => sum + Number(p.precio || 0) * Number(p.cantidad || 1),
    0
  );

  const cantidadTotal = listaSegura.reduce(
    (sum, p) => sum + Number(p.cantidad || 0), 
    0
  );

  useEffect(() => {
    if (token) {
        cargarCarrito();
    } else {
        setCarrito([]);
    }
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        carrito: listaSegura,
        total,
        cantidadTotal,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}