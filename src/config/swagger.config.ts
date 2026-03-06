import swaggerJSDoc from "swagger-jsdoc";
import config from "../config/app.config";

import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Discover IO API", version: "1.0.0" },
    servers: [
      {
        url:
          config.env === "production"
            ? "https://discovery-io-backend.vercel.app/api/v1"
            : `http://localhost:${config.port}/api/v1`,
        description:
          config.env === "production"
            ? "Production server"
            : "Local development server",
      },
    ],
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
        Tool: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            url: { type: "string" },
            pricing: { type: "string" },
            platform: { type: "string" },
            verified_use_cases: { type: "array", items: { type: "string" } },
          },
        },
        Workflow: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            complexity: {
              type: "string",
              enum: ["Beginner", "Intermediate", "Advanced"],
            },
            use_cases: { type: "array", items: { type: "string" } },
            steps: { type: "array", items: { type: "string" } },
            recommended_tools: { type: "array", items: { type: "string" } },
          },
        },
        Solution: {
          type: "object",
          properties: {
            id: { type: "string" },
            issue_title: { type: "string" },
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            cause_explanation: { type: "string" },
            resolution_steps: { type: "array", items: { type: "string" } },
            tradeoffs: { type: "string" },
            recommended_tools: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, "../routes/*.ts"),
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../modules/**/*.route.ts"),
    path.join(__dirname, "../modules/**/*.route.js"),
  ],
};

export default swaggerJSDoc(options);
