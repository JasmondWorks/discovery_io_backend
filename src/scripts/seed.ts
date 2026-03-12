import "dotenv/config";
import mongoose from "mongoose";
import config from "../config/app.config";
import Tool from "../modules/tool/models/tool.model";
import Workflow from "../modules/workflow/models/workflow.model";
import Solution from "../modules/solution/models/solution.model";

import toolsData from "./data/tools.json";
import workflowsData from "./data/workflows.json";
import solutionsData from "./data/solutions.json";

// ── Canonical taxonomy for validation ──────────────────────────────
const VALID_CATEGORIES = [
  "AI Writing",
  "AI Design",
  "AI Development",
  "AI Video",
  "AI Audio",
  "AI Productivity",
  "AI Marketing",
  "AI Research",
  "AI Data & Analytics",
  "AI Automation",
  "AI Presentation",
  "AI Image Generation",
  "AI Code Generation",
  "AI SEO",
  "AI Customer Support",
  "AI Project Management",
];

const VALID_USE_CASE_SLUGS = [
  "copywriting",
  "blog_writing",
  "email_writing",
  "technical_writing",
  "content_repurposing",
  "proofreading",
  "summarization",
  "scriptwriting",
  "social_media_writing",
  "seo_writing",
  "long_form_writing",
  "newsletter_writing",
  "ui_design",
  "graphic_design",
  "image_generation",
  "logo_design",
  "mockups",
  "prototyping",
  "design_system",
  "brand_identity",
  "illustration",
  "photo_editing",
  "video_editing",
  "animation",
  "code_generation",
  "code_review",
  "debugging",
  "documentation",
  "api_development",
  "testing",
  "deployment",
  "infrastructure",
  "database_design",
  "schema_migration",
  "frontend_development",
  "backend_development",
  "video_generation",
  "screen_recording",
  "podcast_production",
  "voice_cloning",
  "text_to_speech",
  "transcription",
  "subtitles",
  "music_generation",
  "sound_design",
  "task_management",
  "note_taking",
  "meeting_summarization",
  "research",
  "knowledge_management",
  "scheduling",
  "workflow_automation",
  "data_extraction",
  "web_scraping",
  "competitive_analysis",
  "trend_analysis",
  "reporting",
  "ad_creation",
  "seo_optimization",
  "email_marketing",
  "social_media_management",
  "analytics",
  "lead_generation",
  "funnel_building",
  "landing_page",
  "presentation_design",
  "slide_generation",
  "pitch_deck",
  "data_visualization",
  "personal_branding",
  "user_research",
  "localization", // Added from solution tags
  "security", // Added from solution tags/categories
  "privacy",
  "compliance",
  "finance",
  "productivity",
  "branding",
  "sales",
  "outreach",
  "meeting_management",
  "latency",
];

const VALID_TAGS = [
  "graphic_designer",
  "content_writer",
  "software_engineer",
  "marketer",
  "product_manager",
  "video_creator",
  "ui_ux_designer",
  "data_analyst",
  "startup_founder",
  "developer",
  // Solution specific tags
  "cors",
  "express",
  "backend",
  "api",
  "react",
  "nextjs",
  "frontend",
  "ssr",
  "hydration",
  "authentication",
  "security",
  "jwt",
  "deployment",
  "devops",
  "vercel",
  "aws",
  "docker",
  "image_generation",
  "prompt_engineering",
  "design",
  "creative_ai",
  "ai_chat",
  "rag",
  "knowledge_management",
  "video_generation",
  "social_media",
  "content_creation",
  "automation",
  "seo",
  "writing",
  "marketing",
  "latency",
  "ui_ux",
  "privacy",
  "compliance",
  "sales",
  "outreach",
  "productivity",
  "meeting_management",
  "finance",
  "data_analysis",
  "code_generation",
  "backend_development",
  "frontend_development",
  "branding",
  "copywriting",
];

// ── Types ──────────────────────────────────────────────────────────
interface SeedResult {
  new: number;
  updated: number;
  skipped: number;
  errors: string[];
}

// ── Validation ─────────────────────────────────────────────────────
function validateTool(tool: any): string[] {
  const errors: string[] = [];
  if (!tool.name) errors.push("Missing name");
  if (!tool.description) errors.push("Missing description");
  if (!tool.url) errors.push("Missing url");
  if (!tool.pricing) errors.push("Missing pricing");
  if (!tool.platform) errors.push("Missing platform");

  if (tool.category && !VALID_CATEGORIES.includes(tool.category)) {
    errors.push(`Invalid category: "${tool.category}"`);
  }

  if (tool.verified_use_cases && Array.isArray(tool.verified_use_cases)) {
    const invalidSlugs = tool.verified_use_cases.filter(
      (s: string) => !VALID_USE_CASE_SLUGS.includes(s),
    );
    if (invalidSlugs.length > 0) {
      errors.push(`Invalid use_case slugs: ${invalidSlugs.join(", ")}`);
    }
  }

  if (tool.tags && Array.isArray(tool.tags)) {
    const invalidTags = tool.tags.filter(
      (t: string) => !VALID_TAGS.includes(t),
    );
    if (invalidTags.length > 0) {
      errors.push(`Invalid tags: ${invalidTags.join(", ")}`);
    }
  }

  return errors;
}

function validateWorkflow(workflow: any): string[] {
  const errors: string[] = [];
  if (!workflow.title) errors.push("Missing title");
  if (!workflow.description) errors.push("Missing description");
  if (!workflow.complexity) errors.push("Missing complexity");
  if (!workflow.steps || !Array.isArray(workflow.steps))
    errors.push("Missing or invalid steps");

  if (workflow.use_cases && Array.isArray(workflow.use_cases)) {
    const invalidSlugs = workflow.use_cases.filter(
      (s: string) =>
        !VALID_USE_CASE_SLUGS.includes(s) && !VALID_TAGS.includes(s),
    );
    if (invalidSlugs.length > 0) {
      errors.push(`Invalid use_cases: ${invalidSlugs.join(", ")}`);
    }
  }
  return errors;
}

function validateSolution(solution: any): string[] {
  const errors: string[] = [];
  if (!solution.issue_title) errors.push("Missing issue_title");
  if (!solution.description) errors.push("Missing description");
  if (!solution.cause_explanation) errors.push("Missing cause_explanation");
  if (!solution.resolution_steps || !Array.isArray(solution.resolution_steps))
    errors.push("Missing or invalid resolution_steps");

  if (solution.tags && Array.isArray(solution.tags)) {
    const invalidTags = solution.tags.filter(
      (t: string) =>
        !VALID_TAGS.includes(t) && !VALID_USE_CASE_SLUGS.includes(t),
    );
    if (invalidTags.length > 0) {
      errors.push(`Invalid tags: ${invalidTags.join(", ")}`);
    }
  }
  return errors;
}

// ── Seeders ────────────────────────────────────────────────────────
async function seedTools(): Promise<SeedResult> {
  const result: SeedResult = { new: 0, updated: 0, skipped: 0, errors: [] };

  for (const tool of toolsData as any[]) {
    const validationErrors = validateTool(tool);
    if (validationErrors.length > 0) {
      result.skipped++;
      result.errors.push(
        `[TOOL:${tool.name || "UNNAMED"}] ${validationErrors.join("; ")}`,
      );
      continue;
    }
    try {
      const existing = await Tool.findOne({ name: tool.name });
      await Tool.findOneAndUpdate(
        { name: tool.name },
        { $set: tool },
        { upsert: true, new: true, runValidators: true },
      );
      existing ? result.updated++ : result.new++;
    } catch (err: any) {
      result.skipped++;
      result.errors.push(`[TOOL:${tool.name}] DB Error: ${err.message}`);
    }
  }

  return result;
}

async function seedWorkflows(): Promise<SeedResult> {
  const result: SeedResult = { new: 0, updated: 0, skipped: 0, errors: [] };

  for (const workflow of workflowsData as any[]) {
    const validationErrors = validateWorkflow(workflow);
    if (validationErrors.length > 0) {
      result.skipped++;
      result.errors.push(
        `[WORKFLOW:${workflow.title || "UNNAMED"}] ${validationErrors.join("; ")}`,
      );
      continue;
    }
    try {
      const existing = await Workflow.findOne({ title: workflow.title });
      await Workflow.findOneAndUpdate(
        { title: workflow.title },
        { $set: workflow },
        { upsert: true, new: true, runValidators: true },
      );
      existing ? result.updated++ : result.new++;
    } catch (err: any) {
      result.skipped++;
      result.errors.push(
        `[WORKFLOW:${workflow.title}] DB Error: ${err.message}`,
      );
    }
  }

  return result;
}

async function seedSolutions(): Promise<SeedResult> {
  const result: SeedResult = { new: 0, updated: 0, skipped: 0, errors: [] };

  for (const solution of solutionsData as any[]) {
    const validationErrors = validateSolution(solution);
    if (validationErrors.length > 0) {
      result.skipped++;
      result.errors.push(
        `[SOLUTION:${solution.issue_title || "UNNAMED"}] ${validationErrors.join("; ")}`,
      );
      continue;
    }
    try {
      const existing = await Solution.findOne({
        issue_title: solution.issue_title,
      });
      await Solution.findOneAndUpdate(
        { issue_title: solution.issue_title },
        { $set: solution },
        { upsert: true, new: true, runValidators: true },
      );
      existing ? result.updated++ : result.new++;
    } catch (err: any) {
      result.skipped++;
      result.errors.push(
        `[SOLUTION:${solution.issue_title}] DB Error: ${err.message}`,
      );
    }
  }

  return result;
}

// ── Main ───────────────────────────────────────────────────────────
async function runSeed() {
  console.log("🌱 Starting Discover.io database seed...\n");

  try {
    await mongoose.connect(config.db.url);
    console.log("✅ Connected to MongoDB\n");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }

  const toolResult = await seedTools();
  const workflowResult = await seedWorkflows();
  const solutionResult = await seedSolutions();

  console.log("\n=== SEED RESULTS ===");
  console.log(
    `Tools:     ${toolResult.new} new, ${toolResult.updated} updated, ${toolResult.skipped} skipped`,
  );
  console.log(
    `Workflows: ${workflowResult.new} new, ${workflowResult.updated} updated, ${workflowResult.skipped} skipped`,
  );
  console.log(
    `Solutions: ${solutionResult.new} new, ${solutionResult.updated} updated, ${solutionResult.skipped} skipped`,
  );

  const allErrors = [
    ...toolResult.errors,
    ...workflowResult.errors,
    ...solutionResult.errors,
  ];
  if (allErrors.length > 0) {
    console.log(`\n⚠️  ${allErrors.length} item(s) had errors:`);
    allErrors.forEach((e) => console.log(`  - ${e}`));
  } else {
    console.log("\n✅ All items seeded successfully. Zero errors.");
  }

  await mongoose.disconnect();
  console.log("\n✅ Seed complete. MongoDB connection closed.");
  process.exit(0);
}

runSeed();
