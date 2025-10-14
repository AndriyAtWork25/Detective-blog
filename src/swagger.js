// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API Documentation",
      version: "1.0.0",
      description: "API documentation for the Detective Blog project.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // path to the routes
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };

