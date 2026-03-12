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
            role: { type: "string", enum: ["USER", "ADMIN", "SUPER_ADMIN"] },
            active: { type: "boolean" },
            professionalProfile: {
              type: "object",
              properties: {
                industry: {
                  type: "string",
                  enum: [
                    "software_development",
                    "design",
                    "marketing",
                    "content_creation",
                    "other",
                  ],
                },
                core_role: {
                  type: "string",
                  enum: [
                    "software_engineer",
                    "graphic_designer",
                    "content_writer",
                    "product_manager",
                    "marketer",
                    "other",
                  ],
                },
                experience_level: {
                  type: "string",
                  enum: ["beginner", "intermediate", "advanced", "expert"],
                },
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
            category: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
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
        Bookmark: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            tool_id: { type: "string", nullable: true },
            tool_name: { type: "string" },
            tool_description: { type: "string" },
            tool_url: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ChatSession: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            title: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ChatMessage: {
          type: "object",
          properties: {
            id: { type: "string" },
            chat_session_id: { type: "string" },
            role: { type: "string", enum: ["user", "assistant", "system"] },
            content: {
              oneOf: [
                { type: "string" },
                { $ref: "#/components/schemas/ExpertAdvice" },
              ],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ChatIntent: {
          type: "object",
          properties: {
            user_persona: { type: "string" },
            core_task: { type: "string" },
            success_criteria: { type: "string" },
            is_clarification_needed: { type: "boolean" },
          },
        },
        ExpertAdvice: {
          type: "object",
          properties: {
            message: { type: "string" },
            recommended_tools: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  rationale: { type: "string" },
                  usefulness_score: { type: "number" },
                  relevance_score: { type: "number" },
                  reliability_score: { type: "number" },
                  comparison_vs_alternatives: { type: "string" },
                },
              },
            },
            recommended_workflows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  steps: { type: "array", items: { type: "string" } },
                  advantages_of_this_workflow: { type: "string" },
                },
              },
            },
            recommended_solutions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  issue_title: { type: "string" },
                  cause_explanation: { type: "string" },
                  resolution_steps: {
                    type: "array",
                    items: { type: "string" },
                  },
                  why_this_fix_is_optimal: { type: "string" },
                },
              },
            },
            tradeoff_analysis: { type: "string" },
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
