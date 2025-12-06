# 🛒 ZENTRO — E-Commerce Full Stack

Zentro es una aplicación de comercio electrónico completa, desarrollada como un proyecto full-stack. Permite a los usuarios navegar por productos, gestionar un carrito de compras, realizar ventas y a los administradores gestionar el inventario y usuarios.

**Versión:** 1.0
**Fecha:** Diciembre 2025

---

## 👥 Integrantes del Equipo

Este proyecto fue desarrollado por:

*   **Demis Zúñiga**
*   **Gabriel Colmenares**
*   **Nicolás Tapia**

---

## 🚀 Tecnologías y Arquitectura

El proyecto ZENTRO E-COMMERCE está construido con un stack moderno y se despliega en una arquitectura robusta:

### 🖥️ Frontend
| Tecnología | Versión | Descripción |
| :--- | :--- | :--- |
| **React** | 19 | Biblioteca principal para la construcción de la interfaz de usuario. |
| **Vite** | - | Herramienta de construcción para un desarrollo rápido y eficiente. |
| **React Router DOM** | 7 | Manejo de la navegación y rutas de la aplicación. |
| **Bootstrap 5** | - | Framework CSS para un diseño responsivo y consistente (Atomic Design). |
| **Fetch API** | - | Para la comunicación con el Backend. |

### 🛠 Backend
| Tecnología | Descripción |
| :--- | :--- |
| **Node.js + Express** | API RESTful que maneja rutas para productos, usuarios, carrito, ventas y carga de imágenes. |
| **JSON Web Tokens (JWT)** | Sistema de autenticación para proteger rutas privadas. |
| **Bcrypt** | Utilizado para el hasheo seguro de contraseñas. |
| **CORS** | Configuración para permitir la comunicación entre el Frontend y el Backend. |
| **MySQL2** | Driver para la conexión con la base de datos MySQL. |

### ☁ Hosting / Infraestructura
| Componente | Plataforma |
| :--- | :--- |
| **Backend** | AWS EC2 |
| **Base de Datos** | AWS RDS MySQL (Aurora) |
| **Frontend** | Vercel |
| **Repositorio** | GitHub |

---

## 📌 Funcionalidades Principales

*   **👤 Login y Registro de Usuarios (JWT):** Sistema de autenticación seguro.
*   **🛍 Catálogo de Productos:** Visualización de productos con imágenes, descripciones y stock.
*   **🛒 Carrito de Compras:** Conectado a MySQL, permite sumar, restar y eliminar productos.
*   **🧾 Gestión de Ventas y Pedidos:** Proceso guiado para finalizar la compra y registro de ventas.
*   **🖼 Panel Administrador de Productos (CRUD):** Interfaz para crear, leer, actualizar y eliminar productos.
*   **🔐 Roles Básicos:** Implementación de roles de acceso (`admin` / `usuario`).

---

## 🔗 Endpoints de la API

La API RESTful de ZENTRO E-COMMERCE expone los siguientes endpoints.

**URL Base:** `http://3.208.218.72:3000/api`
**Documentación Interactiva (Swagger):** `http://3.208.218.72:3000/apiswagger`

| Método HTTP | Ruta del Endpoint | Descripción | Requiere Autenticación | Roles Permitidos |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/productos` | Lista todos los productos. | No | N/A |
| `POST` | `/productos` | Crear un nuevo producto. | Sí | Admin |
| `PUT` | `/productos/{id}` | Actualizar un producto existente. | Sí | Admin |
| `DELETE` | `/productos/{id}` | Eliminar un producto. | Sí | Admin |
| `POST` | `/auth/login` | Iniciar sesión (Devuelve JWT). | No | N/A |
| `POST` | `/auth/register` | Registrar un nuevo usuario. | No | N/A |
| `GET` | `/carrito` | Obtener el carrito de compras del usuario. | Sí | Usuario |
| `POST` | `/carrito/agregar` | Agregar un producto al carrito. | Sí | Usuario |
| `PUT` | `/carrito/actualizar/{id}` | Modificar la cantidad de un producto en el carrito. | Sí | Usuario |
| `DELETE` | `/carrito/vaciar` | Vaciar el carrito completo. | Sí | Usuario |
| `POST` | `/ventas/crear` | Crear una nueva venta. | Sí | Usuario |

---

## ⚙️ Estructura del Proyecto

El repositorio está organizado en dos directorios principales:

```
/
├── zentro-react/           # Contiene el código del Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── zentro-backend/         # Contiene el código del Backend (Node.js + Express)
    ├── routes/
    ├── controllers/
    ├── models/
    ├── database/
    ├── zentro.sql          # Respaldo de la Base de Datos AWS
    ├── server.js
    └── database.js
```

---

## 🚀 Instrucciones de Configuración y Ejecución

### 1. Configuración del Backend (`zentro-backend`)

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPO.git
    ```
2.  **Navegar al directorio del Backend:**
    ```bash
    cd TU_REPO/zentro-backend
    ```
3.  **Instalar dependencias:**
    ```bash
    npm install
    ```
4.  **Crear archivo de configuración `.env`** con las credenciales de la base de datos y la clave secreta de JWT:
    ```env
    DB_HOST=tu-endpoint-rds.amazonaws.com
    DB_USER=admin
    DB_PASSWORD=*******
    DB_NAME=zentro
    JWT_SECRET=clave-super-secreta
    ```
5.  **Ejecutar el servidor:**
    ```bash
    node server.js
    ```

### 2. Configuración del Frontend (`zentro-react`)

1.  **Navegar al directorio del Frontend:**
    ```bash
    cd TU_REPO/zentro-react
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Crear archivo de configuración `.env`** con la URL de la API del Backend:
    ```env
    VITE_API_URL=https://tu-servidor-ec2/api
    ```
4.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```

### 3. Restauración de la Base de Datos

Para importar el archivo `zentro.sql` (respaldo de la base de datos) a su instancia de MySQL (AWS o local), utilice el siguiente comando:

```bash
mysql -h tu-rds.amazonaws.com -u admin -p zentro < zentro.sql
```

---

## 🤝 Contribuciones

Pull requests y sugerencias son bienvenidas. Para cambios importantes, por favor, abra un *issue* primero para discutir lo que le gustaría cambiar.

---

## 📄 Licencia

Proyecto bajo licencia **MIT**.

---

## 📄 Documentación Adicional

*   **Manual de Usuario ZENTRO E-COMMERCE:** Este documento contiene una guía detallada para el uso de la plataforma, tanto para clientes como para administradores. (Pendiente de subir por el usuario)
