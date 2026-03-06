import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../modules/tool/models/tool.model";
import config from "../config/app.config";

dotenv.config();

const DB_URI = config.db.url;

const MOCK_TOOLS = [
  {
    name: "ChatGPT",
    description:
      "Advanced conversational AI widely used for coding, writing, and analysis workflows.",
    url: "https://chat.openai.com",
    pricing: "Freemium",
    platform: "Web, iOS, Android",
    verified_use_cases: ["writing", "coding", "brainstorming", "data_analysis"],
  },
  {
    name: "Midjourney",
    description:
      "Highly photorealistic text-to-image AI built directly inside Discord channels.",
    url: "https://midjourney.com",
    pricing: "Paid",
    platform: "Discord",
    verified_use_cases: [
      "design",
      "image_generation",
      "mockups",
      "illustrations",
    ],
  },
  {
    name: "GitHub Copilot",
    description:
      "Your AI pair programmer that provides autocomplete-style suggestions as you code.",
    url: "https://github.com/features/copilot",
    pricing: "Paid",
    platform: "VS Code, JetBrains, Web",
    verified_use_cases: ["coding", "debugging", "software_engineering"],
  },
  {
    name: "Notion AI",
    description:
      "Integrated AI to help you write, summarize, and brainstorm right inside your workspace.",
    url: "https://www.notion.so/product/ai",
    pricing: "Paid",
    platform: "Web, Desktop, Mobile",
    verified_use_cases: ["writing", "project_management", "content_creation"],
  },
  {
    name: "Jasper",
    description:
      "AI tailored exactly for enterprise marketing teams to generate high-converting copy.",
    url: "https://www.jasper.ai",
    pricing: "Paid",
    platform: "Web",
    verified_use_cases: ["marketing", "copywriting", "seo_optimization"],
  },
  {
    name: "Figma AI",
    description:
      "Integrates AI features natively into Figma, accelerating product and UI/UX design.",
    url: "https://www.figma.com",
    pricing: "Freemium",
    platform: "Web, Desktop",
    verified_use_cases: ["design", "ui_ux", "prototyping"],
  },
  {
    name: "Cursor",
    description:
      "An AI-first code editor designed to make programming faster and completely context-aware of your codebase.",
    url: "https://cursor.com",
    pricing: "Freemium",
    platform: "Desktop",
    verified_use_cases: ["coding", "software_engineering", "debugging"],
  },
  {
    name: "Writesonic",
    description:
      "AI writer equipped with SEO optimization specifically for content creators and marketers.",
    url: "https://writesonic.com",
    pricing: "Freemium",
    platform: "Web",
    verified_use_cases: ["writing", "seo_optimization", "content_creation"],
  },
  {
    name: "Vercel v0",
    description:
      "Generative UI system by Vercel that converts natural language into ready-to-use React components.",
    url: "https://v0.dev",
    pricing: "Freemium",
    platform: "Web",
    verified_use_cases: ["coding", "frontend_development", "ui_ux"],
  },
  {
    name: "Canva Magic Studio",
    description:
      "Makes graphic design highly accessible with one-click AI generative expand, rewrite, and image editing features.",
    url: "https://www.canva.com/magic/",
    pricing: "Freemium",
    platform: "Web, Mobile",
    verified_use_cases: ["design", "graphic_design", "marketing_materials"],
  },
];

const seedDB = async () => {
  if (!DB_URI) {
    console.error("No Database configured. Cannot run seed.");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(DB_URI);

    console.log("Dropping old Tool collections...");
    await Tool.deleteMany({});

    console.log("Seeding Catalog...");
    await Tool.insertMany(MOCK_TOOLS);

    console.log(
      `Successfully imported ${MOCK_TOOLS.length} tools into the database!`,
    );
    mongoose.connection.close();
  } catch (error) {
    console.error("Error with seeding:", error);
    process.exit(1);
  }
};

seedDB();
