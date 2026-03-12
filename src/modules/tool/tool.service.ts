import Tool from "./models/tool.model";
import { MongooseRepository } from "../../utils/crud.util";

/**
 * Full updated role mapping for getToolsForUser.
 * Maps each CoreRole value to the verified_use_cases that are most relevant
 * for that role. Used to power the personalized catalog (PRD Feature 3).
 */
const ROLE_TO_USE_CASES: Record<string, string[]> = {
  graphic_designer: [
    "image_generation",
    "graphic_design",
    "logo_design",
    "illustration",
    "photo_editing",
    "brand_identity",
    "mockups",
    "animation",
    "video_editing",
  ],
  content_writer: [
    "copywriting",
    "blog_writing",
    "long_form_writing",
    "seo_writing",
    "email_writing",
    "proofreading",
    "summarization",
    "content_repurposing",
    "newsletter_writing",
    "scriptwriting",
    "social_media_writing",
  ],
  software_engineer: [
    "code_generation",
    "code_review",
    "debugging",
    "documentation",
    "testing",
    "deployment",
    "backend_development",
    "frontend_development",
    "api_development",
    "database_design",
    "infrastructure",
    "schema_migration",
  ],
  marketer: [
    "copywriting",
    "ad_creation",
    "seo_optimization",
    "email_marketing",
    "social_media_writing",
    "social_media_management",
    "analytics",
    "lead_generation",
    "funnel_building",
    "landing_page",
    "competitive_analysis",
  ],
  product_manager: [
    "task_management",
    "research",
    "summarization",
    "presentation_design",
    "meeting_summarization",
    "prototyping",
    "analytics",
    "knowledge_management",
    "reporting",
    "workflow_automation",
  ],
  ui_ux_designer: [
    "ui_design",
    "prototyping",
    "design_system",
    "mockups",
    "user_research",
    "frontend_development",
    "brand_identity",
  ],
  video_creator: [
    "video_generation",
    "video_editing",
    "animation",
    "text_to_speech",
    "voice_cloning",
    "podcast_production",
    "subtitles",
    "content_repurposing",
    "music_generation",
    "transcription",
  ],
  data_analyst: [
    "analytics",
    "data_extraction",
    "reporting",
    "research",
    "trend_analysis",
    "web_scraping",
    "data_visualization",
  ],
  developer: [
    "code_generation",
    "code_review",
    "debugging",
    "documentation",
    "testing",
    "deployment",
    "backend_development",
    "frontend_development",
  ],
  startup_founder: [
    "copywriting",
    "presentation_design",
    "pitch_deck",
    "analytics",
    "workflow_automation",
    "lead_generation",
    "email_marketing",
    "prototyping",
  ],
  other: [
    "summarization",
    "research",
    "task_management",
    "note_taking",
    "meeting_summarization",
    "workflow_automation",
  ],
};

/** Maps industry values to supplementary use_cases (broadens results). */
const INDUSTRY_TO_USE_CASES: Record<string, string[]> = {
  software_development: [
    "code_generation",
    "debugging",
    "deployment",
    "documentation",
    "testing",
  ],
  design: [
    "image_generation",
    "graphic_design",
    "ui_design",
    "prototyping",
    "brand_identity",
  ],
  marketing: [
    "ad_creation",
    "seo_optimization",
    "email_marketing",
    "social_media_management",
    "analytics",
  ],
  content_creation: [
    "blog_writing",
    "video_editing",
    "podcast_production",
    "content_repurposing",
    "seo_writing",
  ],
  other: [
    "summarization",
    "research",
    "task_management",
    "workflow_automation",
  ],
};

const FEATURED_FALLBACK_TOOLS = [
  "ChatGPT",
  "Claude",
  "Notion AI",
  "Canva Magic Studio",
  "Perplexity AI",
  "GitHub Copilot",
  "Gamma",
  "GrammarlyGO",
  "Zapier Central (Zapier AI)",
  "Otter.ai",
];

export class ToolService {
  private repository: MongooseRepository<any>;

  constructor() {
    this.repository = new MongooseRepository(Tool);
  }

  async getAllTools(queryParams: any) {
    return await this.repository.findAll(queryParams, {}, [
      "name",
      "description",
      "verified_use_cases",
      "category",
      "tags",
    ]);
  }

  async getToolById(id: string) {
    return await this.repository.findById(id);
  }

  /**
   * PRD Feature 3 — Personalized Tools Catalog.
   *
   * Returns tools that match the user's core role and/or industry, grouped by
   * their category.
   *
   * 1. Expand role-to-use-case mapping to cover all new tools and slugs
   * 2. Return at least 10 tools per user
   * 3. Handle the case where a user has no professionalProfile (return featured fallback)
   * 4. Add a featured fallback — if fewer than 10 tools match, pad with high-relevance general tools
   */
  async getToolsForUser(user: any) {
    const profile = user.professionalProfile;

    if (!profile || (!profile.core_role && !profile.industry)) {
      // No profile yet or onboarding incomplete — return featured fallback tools
      const featuredTools = await Tool.find({
        name: { $in: FEATURED_FALLBACK_TOOLS },
      }).sort({ name: 1 });

      return {
        grouped: true,
        onboardingCompleted: false,
        message:
          "Complete your onboarding to see personalized recommendations.",
        catalog: this.groupToolsByCategory(featuredTools),
      };
    }

    // Build the set of relevant use_cases from role + industry
    const roleUseCases =
      ROLE_TO_USE_CASES[profile.core_role as string] ||
      ROLE_TO_USE_CASES["other"];
    const industryUseCases =
      INDUSTRY_TO_USE_CASES[profile.industry as string] ||
      INDUSTRY_TO_USE_CASES["other"];

    const relevantUseCases = Array.from(
      new Set([...roleUseCases, ...industryUseCases]),
    );

    // Query tools that match by verified_use_cases OR tags
    let matchedTools = await Tool.find({
      $or: [
        { verified_use_cases: { $in: relevantUseCases } },
        { tags: { $in: relevantUseCases } },
      ],
    }).sort({ name: 1 });

    // Fallback: If search result is sparse (< 10 tools), pad with "Featured" tools
    if (matchedTools.length < 10) {
      const alreadyMatchedNames = matchedTools.map((t) => (t as any).name);
      const remainingSlots = 10 - matchedTools.length;

      const supplementaryTools = await Tool.find({
        name: { $in: FEATURED_FALLBACK_TOOLS, $nin: alreadyMatchedNames },
      })
        .limit(remainingSlots)
        .sort({ name: 1 });

      matchedTools = [...matchedTools, ...supplementaryTools];
    }

    return {
      grouped: true,
      onboardingCompleted: true,
      role: profile.core_role,
      industry: profile.industry,
      catalog: this.groupToolsByCategory(matchedTools),
    };
  }

  /** Helper to group tools by their `category` field */
  private groupToolsByCategory(tools: any[]) {
    const groups: Record<string, any[]> = {};
    for (const tool of tools) {
      const groupKey = (tool as any).category || "General";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push({
        _id: tool._id,
        name: tool.name,
        description: tool.description,
        url: tool.url,
        pricing: tool.pricing,
        platform: tool.platform,
        verified_use_cases: tool.verified_use_cases,
        category: tool.category,
        tags: tool.tags,
      });
    }
    return groups;
  }
}
