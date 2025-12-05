import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Zentro E-Commerce API",
    version: "1.0.0",
    description: "Documentación interactiva de la API del proyecto Zentro",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor local",
    },
    {
      url: "http://3.208.218.72:300/api",
      description: "Producción",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // <-- tus rutas documentadas aquí
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
