# 🛒 ZENTRO — E-Commerce Full Stack

Zentro es una aplicación de comercio electrónico construida con **React (Vite)** en el frontend, **Node.js + Express** en el backend y **MySQL en AWS RDS** como base de datos.  
El proyecto también utiliza **AWS EC2** para alojar la API y Vercel para el frontend.

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend
- React 19
- React Router DOM 7
- Bootstrap 5
- Fetch API
- Vite

### 🛠 Backend
- Node.js + Express
- JSON Web Tokens (JWT)
- Bcrypt para contraseñas
- CORS
- MySQL2

### ☁ Hosting / Infraestructura
- AWS EC2 (Backend)
- AWS RDS MySQL (Base de datos)
- Vercel (Frontend)
- GitHub (Repositorio)

---

## 📦 Estructura del proyecto

/zentro-react
/src
/public
package.json
vite.config.js

/zentro-backend
/routes
/controllers
/models
/database
zentro.sql <-- respaldo de la Base de Datos AWS
server.js
database.js

yaml
Copiar código

---

## ⚙ Configuración del Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPO.git
Instalar dependencias:

bash
Copiar código
cd zentro-backend
npm install
Crear archivo .env:

env
Copiar código
DB_HOST=tu-endpoint-rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=*******
DB_NAME=zentro
JWT_SECRET=clave-super-secreta
Ejecutar backend:

bash
Copiar código
node server.js
🎨 Configuración del Frontend
Instalar dependencias:

bash
Copiar código
cd zentro-react
npm install
Crear archivo .env:

env
Copiar código
VITE_API_URL=https://tu-servidor-ec2/api
Ejecutar en desarrollo:

bash
Copiar código
npm run dev
🗄 Restaurar la base de datos
Para importar el archivo zentro.sql desde AWS o local:

bash
Copiar código
mysql -h tu-rds.amazonaws.com -u admin -p zentro < zentro.sql
📌 Funcionalidades principales
👤 Login y registro de usuarios (JWT)

🛍 Catálogo de productos

🛒 Carrito conectado a MySQL (sumar, restar, eliminar)

🧾 Gestión de ventas y pedidos

🖼 Panel administrador de productos (CRUD)

🔐 Roles básicos (admin / usuario)

📤 Deploy
Frontend: Vercel

Backend: AWS EC2

Base de datos: AWS RDS (MySQL)

🤝 Contribuciones
Pull requests y sugerencias son bienvenidas.

📄 Licencia
Proyecto bajo licencia MIT.

yaml
Copiar código
