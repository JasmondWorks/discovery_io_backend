import swaggerJSDoc from "swagger-jsdoc";
import config from "../config/app.config";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Discover IO API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${config.port}/api/v1` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["user", "admin", "super-admin"] },
            active: { type: "boolean" },
            professionalProfile: {
              type: "object",
              properties: {
                industry: { type: "string" },
                core_role: { type: "string" },
                experience_level: { type: "string" },
                key_skills: { type: "array", items: { type: "string" } },
                primary_tools: { type: "array", items: { type: "string" } },
                daily_responsibilities: {
                  type: "array",
                  items: { type: "string" },
                },
                current_objectives: {
                  type: "array",
                  items: { type: "string" },
                },
                main_pain_points: { type: "array", items: { type: "string" } },
                detailed_context: { type: "string" },
              },
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/modules/**/*.route.ts"],
};

export default swaggerJSDoc(options);
