# DISCOVER.IO — AI AGENT MASTER EXECUTION PROMPT

## Data Layer: Verified Seeding, Coverage & Edge Case Hardening

> **Context**: This prompt is for an AI coding agent (e.g. Cursor, Devin, Copilot Workspace).
> Feed the full project context alongside this prompt.
> The backend is already implemented. Do NOT rebuild what works.
> Your primary mission is the data layer — seeding, coverage, and robustness.

---

## YOUR MISSION (READ THIS FIRST)

The platform is built. The discovery flow is wired. The problem is:
**the database is underpowered and the seed pipeline is fragile.**

A good recommendation engine is only as good as its data.
Right now the DB has 65 tools with minimal metadata. The platform needs to be pre-loaded
with enough verified, richly tagged data that most real user searches return meaningful results
_without hallucination_, even on day one.

Your job, in order of priority:

1. **Expand the tool database to 150+ high-quality, real, verifiable AI tools** with rich metadata
2. **Fix and harden the seed pipeline** so it is idempotent, validated, and safe
3. **Expand workflows to 20+** covering the real use cases of all 5 target user personas
4. **Expand solutions to 15+** covering the most common pain points per persona
5. **Add onboarding question sets** that feed into profile building accurately
6. **Add a category/tag taxonomy** that makes the personalized catalog (`/tools/for-me`) actually useful
7. **Handle every edge case** in the data layer that could break the recommendation engine

---

## SECTION 1 — UNDERSTAND THE EXISTING STRUCTURE

### 1.1 Tool Schema (already in codebase)

```typescript
{
  name: string,               // Unique. Use the official product name exactly.
  description: string,        // 2–3 sentences. What it does + who it's for.
  url: string,                // Official homepage. Must be real and live.
  pricing: string,            // "Free" | "Freemium" | "Paid" | "Free trial"
  platform: string,           // "Web" | "Desktop" | "API" | "Plugin" | "Mobile" | combinations
  verified_use_cases: string[], // Lowercase slug array. See taxonomy below.
  category: string,           // Single category from the taxonomy below.
  tags: string[]              // Role slugs. See persona tags below.
}
```

### 1.2 Workflow Schema (already in codebase)

```typescript
{
  title: string,
  description: string,
  complexity: "Beginner" | "Intermediate" | "Advanced",
  use_cases: string[],
  steps: string[],
  recommended_tools: string[]  // Must match real tool names in the DB
}
```

### 1.3 Solution Schema (already in codebase)

```typescript
{
  issue_title: string,         // REQUIRED — this was the source of the previous seed bug
  description: string,
  tags: string[],
  cause_explanation: string,
  resolution_steps: string[],
  tradeoffs: string,
  recommended_tools: string[]  // Must match real tool names in the DB
}
```

---

## SECTION 2 — CATEGORY & TAG TAXONOMY (CANONICAL — DO NOT DEVIATE)

### 2.1 Tool Categories (use exactly these strings in the `category` field)

```
"AI Writing"
"AI Design"
"AI Development"
"AI Video"
"AI Audio"
"AI Productivity"
"AI Marketing"
"AI Research"
"AI Data & Analytics"
"AI Automation"
"AI Presentation"
"AI Image Generation"
"AI Code Generation"
"AI SEO"
"AI Customer Support"
"AI Project Management"
```

### 2.2 Verified Use Case Slugs (use exactly these in `verified_use_cases[]`)

```
# Writing
"copywriting", "blog_writing", "email_writing", "technical_writing",
"content_repurposing", "proofreading", "summarization", "scriptwriting",
"social_media_writing", "seo_writing", "long_form_writing", "newsletter_writing"

# Design
"ui_design", "graphic_design", "image_generation", "logo_design",
"mockups", "prototyping", "design_system", "brand_identity",
"illustration", "photo_editing", "video_editing", "animation"

# Development
"code_generation", "code_review", "debugging", "documentation",
"api_development", "testing", "deployment", "infrastructure",
"database_design", "schema_migration", "frontend_development", "backend_development"

# Video & Audio
"video_generation", "video_editing", "screen_recording", "podcast_production",
"voice_cloning", "text_to_speech", "transcription", "subtitles",
"music_generation", "sound_design"

# Productivity & Research
"task_management", "note_taking", "meeting_summarization", "research",
"knowledge_management", "scheduling", "workflow_automation", "data_extraction",
"web_scraping", "competitive_analysis", "trend_analysis", "reporting"

# Marketing
"ad_creation", "seo_optimization", "email_marketing", "social_media_management",
"analytics", "lead_generation", "funnel_building", "landing_page"

# Presentation
"presentation_design", "slide_generation", "pitch_deck", "data_visualization"
```

### 2.3 Persona Tags (use exactly these in `tags[]`)

```
"graphic_designer"
"content_writer"
"software_engineer"
"marketer"
"product_manager"
"video_creator"
"ui_ux_designer"
"data_analyst"
"startup_founder"
"developer"
```

---

## SECTION 3 — TOOL DATA REQUIREMENTS

### 3.1 What Makes a Valid Tool Entry

EVERY tool entry MUST satisfy ALL of the following:

- [ ] `name` matches the tool's real, official product name
- [ ] `url` is the tool's real homepage (no redirect chains, no affiliate links)
- [ ] `description` explains what the tool does AND which persona benefits most
- [ ] `pricing` is one of the four allowed values
- [ ] `platform` reflects where it actually runs
- [ ] `verified_use_cases` has a minimum of 2 and maximum of 6 slugs from the canonical list
- [ ] `category` is exactly one value from the canonical category list
- [ ] `tags` has a minimum of 1 persona tag

### 3.2 Coverage Requirements (Per Persona)

The tool database must ensure that a search for ANY of these user types returns at least 10 highly relevant tools:

| Persona           | Minimum Relevant Tools | Key Categories to Cover                                              |
| ----------------- | ---------------------- | -------------------------------------------------------------------- |
| Graphic Designer  | 15+                    | AI Design, AI Image Generation, AI Video, AI Productivity            |
| Content Writer    | 15+                    | AI Writing, AI SEO, AI Research, AI Productivity                     |
| Software Engineer | 15+                    | AI Code Generation, AI Development, AI Productivity, AI Automation   |
| Marketer          | 12+                    | AI Marketing, AI Writing, AI SEO, AI Analytics                       |
| Product Manager   | 10+                    | AI Productivity, AI Research, AI Presentation, AI Project Management |
| Video Creator     | 10+                    | AI Video, AI Audio, AI Image Generation, AI Writing                  |
| UI/UX Designer    | 12+                    | AI Design, AI Code Generation, AI Productivity                       |

### 3.3 The 150 Tools To Seed

Below is the complete, curated list. Implement ALL of them.
Group by category for readability in the JSON file.

---

#### GROUP A — AI Writing (18 tools)

```json
[
  {
    "name": "ChatGPT",
    "description": "OpenAI's flagship conversational AI. Excels at drafting, editing, summarizing, and brainstorming content for writers, marketers, and developers.",
    "url": "https://chatgpt.com",
    "pricing": "Freemium",
    "platform": "Web, Mobile, API",
    "verified_use_cases": [
      "copywriting",
      "summarization",
      "email_writing",
      "long_form_writing",
      "blog_writing"
    ],
    "category": "AI Writing",
    "tags": [
      "content_writer",
      "marketer",
      "software_engineer",
      "product_manager"
    ]
  },
  {
    "name": "Claude",
    "description": "Anthropic's AI assistant known for nuanced long-form writing, document analysis, and thoughtful reasoning. Ideal for writers and researchers.",
    "url": "https://claude.ai",
    "pricing": "Freemium",
    "platform": "Web, API",
    "verified_use_cases": [
      "long_form_writing",
      "summarization",
      "technical_writing",
      "research",
      "copywriting"
    ],
    "category": "AI Writing",
    "tags": [
      "content_writer",
      "software_engineer",
      "product_manager",
      "data_analyst"
    ]
  },
  {
    "name": "Jasper",
    "description": "AI writing platform built for marketing teams. Generates on-brand copy for ads, blogs, emails, and social media at scale.",
    "url": "https://jasper.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "copywriting",
      "blog_writing",
      "email_writing",
      "ad_creation",
      "social_media_writing"
    ],
    "category": "AI Writing",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Copy.ai",
    "description": "AI copywriting tool for generating marketing copy, product descriptions, and social content. Includes 90+ templates.",
    "url": "https://copy.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "copywriting",
      "social_media_writing",
      "email_writing",
      "ad_creation"
    ],
    "category": "AI Writing",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Writesonic",
    "description": "AI writing platform combining copywriting, SEO-optimized articles, and a Chatsonic AI assistant. Good for agencies and solo creators.",
    "url": "https://writesonic.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "blog_writing",
      "seo_writing",
      "copywriting",
      "email_writing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer", "marketer"]
  },
  {
    "name": "GrammarlyGO",
    "description": "AI writing assistant integrated into Grammarly. Helps with grammar, tone adjustment, rewriting, and generative writing tasks.",
    "url": "https://grammarly.com",
    "pricing": "Freemium",
    "platform": "Web, Plugin, Desktop",
    "verified_use_cases": [
      "proofreading",
      "email_writing",
      "copywriting",
      "technical_writing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer", "marketer", "product_manager"]
  },
  {
    "name": "Notion AI",
    "description": "AI assistant built into Notion for summarizing notes, drafting docs, generating action items, and auto-filling databases.",
    "url": "https://notion.so",
    "pricing": "Freemium",
    "platform": "Web, Desktop, Mobile",
    "verified_use_cases": [
      "summarization",
      "note_taking",
      "long_form_writing",
      "task_management"
    ],
    "category": "AI Productivity",
    "tags": ["product_manager", "content_writer", "software_engineer"]
  },
  {
    "name": "Rytr",
    "description": "Affordable AI writing assistant for generating short-form copy, emails, and blog sections. Best for solo creators on a budget.",
    "url": "https://rytr.me",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "copywriting",
      "blog_writing",
      "email_writing",
      "social_media_writing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer", "marketer"]
  },
  {
    "name": "Sudowrite",
    "description": "AI writing tool designed specifically for fiction writers. Helps with story generation, character development, and prose enhancement.",
    "url": "https://sudowrite.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "long_form_writing",
      "scriptwriting",
      "content_repurposing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer"]
  },
  {
    "name": "Quillbot",
    "description": "AI paraphrasing and summarization tool. Widely used by writers for rewording content, condensing articles, and checking grammar.",
    "url": "https://quillbot.com",
    "pricing": "Freemium",
    "platform": "Web, Plugin",
    "verified_use_cases": [
      "proofreading",
      "summarization",
      "content_repurposing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer", "marketer"]
  },
  {
    "name": "Wordtune",
    "description": "AI writing companion that suggests rewordings, tone shifts, and expansions inline while you write. Works as a browser extension.",
    "url": "https://wordtune.com",
    "pricing": "Freemium",
    "platform": "Web, Plugin",
    "verified_use_cases": ["copywriting", "proofreading", "email_writing"],
    "category": "AI Writing",
    "tags": ["content_writer", "marketer"]
  },
  {
    "name": "Hypotenuse AI",
    "description": "Bulk AI content generator for eCommerce product descriptions, blog articles, and ad copy at scale.",
    "url": "https://hypotenuse.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["copywriting", "seo_writing", "blog_writing"],
    "category": "AI Writing",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Anyword",
    "description": "AI copywriting platform with predictive performance scores. Helps marketers optimize ad copy before publishing.",
    "url": "https://anyword.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "ad_creation",
      "copywriting",
      "email_writing",
      "social_media_writing"
    ],
    "category": "AI Marketing",
    "tags": ["marketer"]
  },
  {
    "name": "Beehiiv AI",
    "description": "AI writing and newsletter growth platform. Built-in AI assists with drafting, repurposing, and growing newsletter audiences.",
    "url": "https://beehiiv.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "newsletter_writing",
      "email_writing",
      "content_repurposing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer", "marketer"]
  },
  {
    "name": "Hemingway Editor",
    "description": "Clarity-focused writing tool that highlights complex sentences, passive voice, and readability issues. Now includes AI rewriting.",
    "url": "https://hemingwayapp.com",
    "pricing": "Freemium",
    "platform": "Web, Desktop",
    "verified_use_cases": ["proofreading", "blog_writing", "long_form_writing"],
    "category": "AI Writing",
    "tags": ["content_writer"]
  },
  {
    "name": "Perplexity AI",
    "description": "AI-powered search and research tool that cites sources in real time. Ideal for research-heavy writers and analysts.",
    "url": "https://perplexity.ai",
    "pricing": "Freemium",
    "platform": "Web, Mobile",
    "verified_use_cases": [
      "research",
      "summarization",
      "competitive_analysis",
      "technical_writing"
    ],
    "category": "AI Research",
    "tags": [
      "content_writer",
      "data_analyst",
      "product_manager",
      "software_engineer"
    ]
  },
  {
    "name": "Longshot AI",
    "description": "AI content platform focused on factual accuracy and SEO. Includes fact-checking, SERP analysis, and long-form generation.",
    "url": "https://longshot.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["seo_writing", "blog_writing", "research"],
    "category": "AI SEO",
    "tags": ["content_writer", "marketer"]
  },
  {
    "name": "Lex",
    "description": "AI-powered word processor for professional writers. Provides real-time writing suggestions and collaborative editing.",
    "url": "https://lex.page",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "long_form_writing",
      "blog_writing",
      "newsletter_writing"
    ],
    "category": "AI Writing",
    "tags": ["content_writer"]
  }
]
```

#### GROUP B — AI Design & Image Generation (18 tools)

```json
[
  {
    "name": "Midjourney",
    "description": "Leading AI image generation tool known for photorealistic and artistic image quality. Used by designers, illustrators, and creators.",
    "url": "https://midjourney.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "image_generation",
      "illustration",
      "brand_identity",
      "graphic_design"
    ],
    "category": "AI Image Generation",
    "tags": ["graphic_designer", "ui_ux_designer", "marketer", "content_writer"]
  },
  {
    "name": "Adobe Firefly",
    "description": "Adobe's generative AI suite integrated into Photoshop and Illustrator. Enables AI image generation, style transfer, and generative fill.",
    "url": "https://firefly.adobe.com",
    "pricing": "Freemium",
    "platform": "Web, Plugin",
    "verified_use_cases": [
      "image_generation",
      "photo_editing",
      "graphic_design",
      "illustration",
      "brand_identity"
    ],
    "category": "AI Image Generation",
    "tags": ["graphic_designer", "ui_ux_designer", "marketer"]
  },
  {
    "name": "Canva Magic Studio",
    "description": "AI-powered design features inside Canva including Magic Design, Magic Write, and background removal. Ideal for non-designers.",
    "url": "https://canva.com",
    "pricing": "Freemium",
    "platform": "Web, Mobile, Desktop",
    "verified_use_cases": [
      "graphic_design",
      "social_media_writing",
      "presentation_design",
      "logo_design"
    ],
    "category": "AI Design",
    "tags": ["marketer", "content_writer", "startup_founder"]
  },
  {
    "name": "Figma AI",
    "description": "AI features inside Figma including auto-layout suggestions, design linting, and generative UI components. Core tool for product designers.",
    "url": "https://figma.com",
    "pricing": "Freemium",
    "platform": "Web, Desktop",
    "verified_use_cases": [
      "ui_design",
      "prototyping",
      "design_system",
      "mockups"
    ],
    "category": "AI Design",
    "tags": ["ui_ux_designer", "graphic_designer", "product_manager"]
  },
  {
    "name": "Leonardo.ai",
    "description": "AI image generation platform with fine-tuned models for consistent character design, game assets, and product mockups.",
    "url": "https://leonardo.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "image_generation",
      "graphic_design",
      "mockups",
      "illustration"
    ],
    "category": "AI Image Generation",
    "tags": ["graphic_designer", "video_creator", "ui_ux_designer"]
  },
  {
    "name": "DALL-E 3",
    "description": "OpenAI's image generation model integrated into ChatGPT. Best for accurate text-in-image rendering and photorealistic outputs.",
    "url": "https://openai.com/dall-e-3",
    "pricing": "Freemium",
    "platform": "Web, API",
    "verified_use_cases": [
      "image_generation",
      "illustration",
      "graphic_design"
    ],
    "category": "AI Image Generation",
    "tags": ["graphic_designer", "marketer", "content_writer"]
  },
  {
    "name": "Stable Diffusion (via Automatic1111)",
    "description": "Open-source AI image generation model. Run locally or via hosted services. High degree of control for technical designers.",
    "url": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    "pricing": "Free",
    "platform": "Desktop, API",
    "verified_use_cases": ["image_generation", "photo_editing", "illustration"],
    "category": "AI Image Generation",
    "tags": ["graphic_designer", "software_engineer", "developer"]
  },
  {
    "name": "Uizard",
    "description": "AI tool that converts sketches and screenshots into editable UI wireframes and prototypes. Designed for non-technical founders and PMs.",
    "url": "https://uizard.io",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["ui_design", "prototyping", "mockups"],
    "category": "AI Design",
    "tags": ["product_manager", "startup_founder", "ui_ux_designer"]
  },
  {
    "name": "Framer AI",
    "description": "AI-powered website builder that generates full websites from text prompts. Includes animations and CMS capabilities.",
    "url": "https://framer.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "frontend_development",
      "prototyping",
      "landing_page",
      "ui_design"
    ],
    "category": "AI Design",
    "tags": ["ui_ux_designer", "graphic_designer", "startup_founder"]
  },
  {
    "name": "Khroma",
    "description": "AI-powered color palette generator that learns your color preferences. Built for graphic designers and brand teams.",
    "url": "https://khroma.co",
    "pricing": "Free",
    "platform": "Web",
    "verified_use_cases": ["brand_identity", "design_system", "graphic_design"],
    "category": "AI Design",
    "tags": ["graphic_designer", "ui_ux_designer"]
  },
  {
    "name": "Looka",
    "description": "AI logo and brand identity generator. Creates logos, business cards, and brand kits from a style quiz.",
    "url": "https://looka.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["logo_design", "brand_identity"],
    "category": "AI Design",
    "tags": ["startup_founder", "marketer", "graphic_designer"]
  },
  {
    "name": "Relume",
    "description": "AI-powered website sitemap and wireframe generator. Produces Figma-ready components from a brief description.",
    "url": "https://relume.io",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "ui_design",
      "prototyping",
      "mockups",
      "design_system"
    ],
    "category": "AI Design",
    "tags": ["ui_ux_designer", "graphic_designer", "startup_founder"]
  },
  {
    "name": "Ideogram",
    "description": "AI image generator with exceptional text rendering accuracy. Best for poster design, typography-heavy graphics, and memes.",
    "url": "https://ideogram.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "image_generation",
      "graphic_design",
      "social_media_writing"
    ],
    "category": "AI Image Generation",
    "tags": ["graphic_designer", "marketer", "content_writer"]
  },
  {
    "name": "Pika Labs",
    "description": "AI video generation tool that turns images and text prompts into short animated clips. Used for social content and ads.",
    "url": "https://pika.art",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["video_generation", "animation", "ad_creation"],
    "category": "AI Video",
    "tags": ["video_creator", "marketer", "graphic_designer"]
  },
  {
    "name": "Kling AI",
    "description": "Chinese-developed AI video generation model producing high-quality 5-second and 10-second clips from text or image prompts.",
    "url": "https://klingai.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["video_generation", "animation"],
    "category": "AI Video",
    "tags": ["video_creator", "graphic_designer"]
  },
  {
    "name": "Removebg",
    "description": "AI background removal tool. Instantly removes image backgrounds with one click. Essential for product and design workflows.",
    "url": "https://remove.bg",
    "pricing": "Freemium",
    "platform": "Web, API",
    "verified_use_cases": ["photo_editing", "graphic_design", "mockups"],
    "category": "AI Design",
    "tags": ["graphic_designer", "marketer", "content_writer"]
  },
  {
    "name": "Cleanup.pictures",
    "description": "AI image inpainting tool that removes unwanted objects from photos. Useful for photo retouching and product photography.",
    "url": "https://cleanup.pictures",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["photo_editing", "image_generation"],
    "category": "AI Design",
    "tags": ["graphic_designer", "marketer"]
  },
  {
    "name": "Vectorize.io",
    "description": "AI-powered raster-to-vector conversion tool. Converts logos, illustrations, and sketches to clean SVG files automatically.",
    "url": "https://vectorize.io",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["graphic_design", "logo_design", "illustration"],
    "category": "AI Design",
    "tags": ["graphic_designer"]
  }
]
```

#### GROUP C — AI Development & Code (20 tools)

```json
[
  {
    "name": "GitHub Copilot",
    "description": "AI pair programmer integrated into VS Code and JetBrains IDEs. Suggests code completions, functions, and unit tests in real time.",
    "url": "https://github.com/features/copilot",
    "pricing": "Paid",
    "platform": "Plugin",
    "verified_use_cases": [
      "code_generation",
      "code_review",
      "testing",
      "documentation"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Cursor",
    "description": "AI-first code editor built on VS Code. Supports multi-file edits, codebase-aware chat, and intelligent code generation.",
    "url": "https://cursor.sh",
    "pricing": "Freemium",
    "platform": "Desktop",
    "verified_use_cases": [
      "code_generation",
      "debugging",
      "code_review",
      "documentation",
      "backend_development"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Vercel v0",
    "description": "AI UI generation tool that converts natural language prompts into production-ready React and Tailwind components.",
    "url": "https://v0.dev",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "frontend_development",
      "ui_design",
      "code_generation",
      "prototyping"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer", "ui_ux_designer"]
  },
  {
    "name": "Bolt.new",
    "description": "AI full-stack app generator from StackBlitz. Builds and deploys full applications from a single prompt in the browser.",
    "url": "https://bolt.new",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "code_generation",
      "frontend_development",
      "backend_development",
      "deployment"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer", "startup_founder"]
  },
  {
    "name": "Lovable",
    "description": "AI product builder that generates full-stack applications with Supabase backend from conversational prompts. For founders and engineers.",
    "url": "https://lovable.dev",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "code_generation",
      "frontend_development",
      "backend_development",
      "prototyping"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "startup_founder", "product_manager"]
  },
  {
    "name": "Devin",
    "description": "Autonomous AI software engineer by Cognition. Handles full development tasks including debugging, testing, and deployment end-to-end.",
    "url": "https://cognition.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "code_generation",
      "debugging",
      "testing",
      "deployment"
    ],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Tabnine",
    "description": "Privacy-focused AI code completion tool. Works across 80+ languages with options for self-hosted deployment.",
    "url": "https://tabnine.com",
    "pricing": "Freemium",
    "platform": "Plugin",
    "verified_use_cases": ["code_generation", "code_review"],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Codeium",
    "description": "Free AI code completion and chat assistant. Supports 70+ languages and integrates with all major IDEs.",
    "url": "https://codeium.com",
    "pricing": "Freemium",
    "platform": "Plugin",
    "verified_use_cases": ["code_generation", "debugging", "documentation"],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Replit Ghostwriter",
    "description": "AI coding assistant built into Replit. Helps beginners and professionals write, explain, and debug code in the browser.",
    "url": "https://replit.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "code_generation",
      "debugging",
      "backend_development"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Warp",
    "description": "AI-powered terminal with a built-in AI agent that suggests commands, explains errors, and helps with shell scripting.",
    "url": "https://warp.dev",
    "pricing": "Freemium",
    "platform": "Desktop",
    "verified_use_cases": ["debugging", "infrastructure", "deployment"],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Pieces for Developers",
    "description": "AI developer workflow tool. Captures code snippets from your browser, IDE, and meetings, and provides contextual AI assistance.",
    "url": "https://pieces.app",
    "pricing": "Freemium",
    "platform": "Desktop, Plugin",
    "verified_use_cases": [
      "documentation",
      "code_review",
      "knowledge_management"
    ],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Aider",
    "description": "Open-source AI pair programmer for the command line. Works with GPT-4 and Claude to make code edits across multiple files.",
    "url": "https://aider.chat",
    "pricing": "Free",
    "platform": "Desktop",
    "verified_use_cases": ["code_generation", "debugging", "code_review"],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Sourcegraph Cody",
    "description": "AI coding assistant with deep codebase context. Answers questions about large repositories and suggests changes across files.",
    "url": "https://sourcegraph.com/cody",
    "pricing": "Freemium",
    "platform": "Plugin, Web",
    "verified_use_cases": ["code_review", "documentation", "debugging"],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Mutable AI",
    "description": "AI tool for codebase documentation and accelerated code generation. Generates wiki docs from source code automatically.",
    "url": "https://mutable.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["documentation", "code_generation"],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Sweep AI",
    "description": "AI GitHub bot that converts issues and feature requests into pull requests automatically. Reduces developer ticket resolution time.",
    "url": "https://sweep.dev",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["code_generation", "debugging", "testing"],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Factory AI",
    "description": "AI software development agents that handle full development cycles including code review, testing, and deployment.",
    "url": "https://factory.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "code_generation",
      "testing",
      "deployment",
      "code_review"
    ],
    "category": "AI Development",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Webflow AI",
    "description": "AI-powered website builder with CMS capabilities. Generates responsive web layouts from prompts without coding.",
    "url": "https://webflow.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "frontend_development",
      "landing_page",
      "prototyping"
    ],
    "category": "AI Code Generation",
    "tags": ["ui_ux_designer", "marketer", "startup_founder"]
  },
  {
    "name": "Tempo Labs",
    "description": "AI React development tool that lets designers and engineers build UI components with natural language inside their existing codebase.",
    "url": "https://tempolabs.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "frontend_development",
      "ui_design",
      "code_generation"
    ],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "ui_ux_designer"]
  },
  {
    "name": "Continue.dev",
    "description": "Open-source AI code assistant that plugs into VS Code and JetBrains. Lets you use any LLM model for code generation.",
    "url": "https://continue.dev",
    "pricing": "Free",
    "platform": "Plugin",
    "verified_use_cases": ["code_generation", "code_review", "debugging"],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  },
  {
    "name": "Supermaven",
    "description": "AI code completion tool with an extremely large context window (300K tokens), enabling accurate suggestions across large codebases.",
    "url": "https://supermaven.com",
    "pricing": "Freemium",
    "platform": "Plugin",
    "verified_use_cases": ["code_generation", "code_review"],
    "category": "AI Code Generation",
    "tags": ["software_engineer", "developer"]
  }
]
```

#### GROUP D — AI Video & Audio (14 tools)

```json
[
  {
    "name": "Runway Gen-3 Alpha",
    "description": "State-of-the-art AI video generation model. Creates high-quality video clips from text and image prompts with cinematic quality.",
    "url": "https://runwayml.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["video_generation", "video_editing", "animation"],
    "category": "AI Video",
    "tags": ["video_creator", "graphic_designer", "marketer"]
  },
  {
    "name": "ElevenLabs",
    "description": "AI voice generation and cloning platform. Converts text to ultra-realistic speech in 30+ languages with custom voice cloning.",
    "url": "https://elevenlabs.io",
    "pricing": "Freemium",
    "platform": "Web, API",
    "verified_use_cases": [
      "text_to_speech",
      "voice_cloning",
      "podcast_production"
    ],
    "category": "AI Audio",
    "tags": ["content_writer", "video_creator", "marketer"]
  },
  {
    "name": "Descript",
    "description": "AI-powered audio and video editor that works like a document. Edit recordings by editing the transcript, with overdub and filler-word removal.",
    "url": "https://descript.com",
    "pricing": "Freemium",
    "platform": "Desktop, Web",
    "verified_use_cases": [
      "video_editing",
      "podcast_production",
      "transcription",
      "subtitles"
    ],
    "category": "AI Video",
    "tags": ["video_creator", "content_writer", "marketer"]
  },
  {
    "name": "Synthesia",
    "description": "AI video generation platform for creating presenter-led videos from text. Used for training, explainers, and marketing videos without cameras.",
    "url": "https://synthesia.io",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["video_generation", "scriptwriting", "ad_creation"],
    "category": "AI Video",
    "tags": ["marketer", "video_creator", "content_writer"]
  },
  {
    "name": "Suno",
    "description": "AI music generation tool that creates original songs from text prompts in any style or genre. No music knowledge required.",
    "url": "https://suno.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["music_generation", "sound_design"],
    "category": "AI Audio",
    "tags": ["video_creator", "content_writer", "graphic_designer"]
  },
  {
    "name": "Udio",
    "description": "AI music generator producing high-fidelity songs across genres. Allows stem-level control over instrumentation and vocals.",
    "url": "https://udio.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["music_generation", "sound_design"],
    "category": "AI Audio",
    "tags": ["video_creator", "content_writer"]
  },
  {
    "name": "Luma Dream Machine",
    "description": "Luma AI's video generation model. Creates smooth, physically realistic video from images and text. Strong for product demo videos.",
    "url": "https://lumalabs.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["video_generation", "animation"],
    "category": "AI Video",
    "tags": ["video_creator", "marketer"]
  },
  {
    "name": "Opus Clip",
    "description": "AI video repurposing tool that identifies the most engaging moments in long videos and auto-generates short clips for social media.",
    "url": "https://opus.pro",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "video_editing",
      "content_repurposing",
      "social_media_writing"
    ],
    "category": "AI Video",
    "tags": ["video_creator", "content_writer", "marketer"]
  },
  {
    "name": "Veed.io",
    "description": "Online AI video editor with auto-subtitles, translations, background removal, and AI avatars. Built for social content creators.",
    "url": "https://veed.io",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["video_editing", "subtitles", "content_repurposing"],
    "category": "AI Video",
    "tags": ["video_creator", "content_writer", "marketer"]
  },
  {
    "name": "Otter.ai",
    "description": "AI meeting transcription and summary tool. Joins calls automatically and generates searchable notes with action items.",
    "url": "https://otter.ai",
    "pricing": "Freemium",
    "platform": "Web, Mobile",
    "verified_use_cases": [
      "transcription",
      "meeting_summarization",
      "note_taking"
    ],
    "category": "AI Productivity",
    "tags": [
      "product_manager",
      "content_writer",
      "marketer",
      "software_engineer"
    ]
  },
  {
    "name": "Fathom",
    "description": "AI meeting recorder and summarizer for Zoom. Highlights, summarizes, and creates follow-up tasks from video calls.",
    "url": "https://fathom.video",
    "pricing": "Freemium",
    "platform": "Desktop",
    "verified_use_cases": [
      "meeting_summarization",
      "transcription",
      "note_taking"
    ],
    "category": "AI Productivity",
    "tags": ["product_manager", "marketer", "startup_founder"]
  },
  {
    "name": "Adobe Podcast (Enhance Speech)",
    "description": "Adobe's AI audio enhancement tool. Removes background noise and improves voice quality in podcast and interview recordings.",
    "url": "https://podcast.adobe.com",
    "pricing": "Free",
    "platform": "Web",
    "verified_use_cases": ["podcast_production", "sound_design"],
    "category": "AI Audio",
    "tags": ["content_writer", "video_creator"]
  },
  {
    "name": "HeyGen",
    "description": "AI video generation platform with customizable digital avatars. Used for video marketing, personalized outreach, and training videos.",
    "url": "https://heygen.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["video_generation", "ad_creation", "scriptwriting"],
    "category": "AI Video",
    "tags": ["marketer", "video_creator"]
  },
  {
    "name": "Murf AI",
    "description": "AI voiceover generator with 120+ lifelike voices in 20 languages. Used for explainer videos, e-learning, and ads.",
    "url": "https://murf.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "text_to_speech",
      "voice_cloning",
      "podcast_production"
    ],
    "category": "AI Audio",
    "tags": ["video_creator", "content_writer", "marketer"]
  }
]
```

#### GROUP E — AI Productivity & Research (20 tools)

```json
[
  {
    "name": "Mem",
    "description": "AI-powered note-taking app that automatically organizes notes and resurfaces relevant information in context.",
    "url": "https://mem.ai",
    "pricing": "Freemium",
    "platform": "Web, Mobile",
    "verified_use_cases": ["note_taking", "knowledge_management", "research"],
    "category": "AI Productivity",
    "tags": ["content_writer", "software_engineer", "product_manager"]
  },
  {
    "name": "Superhuman AI",
    "description": "AI-powered email client that triages your inbox, summarizes threads, and drafts replies. Fastest email workflow on the market.",
    "url": "https://superhuman.com",
    "pricing": "Paid",
    "platform": "Web, Desktop, Mobile",
    "verified_use_cases": ["email_writing", "scheduling", "task_management"],
    "category": "AI Productivity",
    "tags": ["startup_founder", "marketer", "product_manager"]
  },
  {
    "name": "Zapier Central (Zapier AI)",
    "description": "AI agent layer on top of Zapier. Builds and runs automated workflows across 6000+ apps using natural language instructions.",
    "url": "https://zapier.com/central",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "workflow_automation",
      "task_management",
      "data_extraction"
    ],
    "category": "AI Automation",
    "tags": [
      "marketer",
      "startup_founder",
      "product_manager",
      "software_engineer"
    ]
  },
  {
    "name": "Make (formerly Integromat)",
    "description": "Visual automation platform with AI capabilities. Connects apps and builds multi-step workflows without code.",
    "url": "https://make.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "workflow_automation",
      "data_extraction",
      "reporting"
    ],
    "category": "AI Automation",
    "tags": ["marketer", "software_engineer", "startup_founder"]
  },
  {
    "name": "Relevance AI",
    "description": "No-code AI agent builder. Creates custom AI tools and agents for sales, research, and support workflows.",
    "url": "https://relevanceai.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "workflow_automation",
      "research",
      "lead_generation"
    ],
    "category": "AI Automation",
    "tags": ["marketer", "startup_founder", "product_manager"]
  },
  {
    "name": "Tines",
    "description": "Security and enterprise automation platform with AI capabilities. Builds no-code workflows for ops and security teams.",
    "url": "https://tines.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "workflow_automation",
      "infrastructure",
      "reporting"
    ],
    "category": "AI Automation",
    "tags": ["software_engineer", "product_manager"]
  },
  {
    "name": "Reclaim AI",
    "description": "AI calendar management tool that auto-schedules tasks, habits, and meetings to maximize deep work time.",
    "url": "https://reclaim.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["scheduling", "task_management"],
    "category": "AI Productivity",
    "tags": ["product_manager", "software_engineer", "startup_founder"]
  },
  {
    "name": "Elicit",
    "description": "AI research assistant for finding and analyzing academic papers. Automates literature reviews and data extraction from studies.",
    "url": "https://elicit.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["research", "summarization", "data_extraction"],
    "category": "AI Research",
    "tags": ["content_writer", "data_analyst", "product_manager"]
  },
  {
    "name": "Consensus",
    "description": "AI-powered academic search engine. Extracts and synthesizes findings from peer-reviewed papers in direct answers.",
    "url": "https://consensus.app",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["research", "summarization"],
    "category": "AI Research",
    "tags": ["content_writer", "data_analyst"]
  },
  {
    "name": "Scite",
    "description": "AI research tool that shows whether papers support or contradict each other. Used for evidence-backed technical and academic writing.",
    "url": "https://scite.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["research", "technical_writing"],
    "category": "AI Research",
    "tags": ["content_writer", "data_analyst"]
  },
  {
    "name": "Gamma",
    "description": "AI presentation and document generator. Creates beautiful slides, docs, and webpages from text prompts in seconds.",
    "url": "https://gamma.app",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "presentation_design",
      "slide_generation",
      "pitch_deck"
    ],
    "category": "AI Presentation",
    "tags": ["marketer", "product_manager", "startup_founder", "content_writer"]
  },
  {
    "name": "Beautiful.ai",
    "description": "AI-powered presentation tool with smart slide templates. Adjusts layouts dynamically as you add content.",
    "url": "https://beautiful.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "presentation_design",
      "slide_generation",
      "pitch_deck"
    ],
    "category": "AI Presentation",
    "tags": ["marketer", "product_manager", "startup_founder"]
  },
  {
    "name": "Tome",
    "description": "AI storytelling and presentation tool. Generates narrative-driven slide decks with imagery from a brief.",
    "url": "https://tome.app",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "presentation_design",
      "pitch_deck",
      "slide_generation"
    ],
    "category": "AI Presentation",
    "tags": ["startup_founder", "marketer", "product_manager"]
  },
  {
    "name": "Taskade",
    "description": "AI-powered project management and collaboration tool. Generates task lists, mind maps, and workflows from prompts.",
    "url": "https://taskade.com",
    "pricing": "Freemium",
    "platform": "Web, Desktop, Mobile",
    "verified_use_cases": [
      "task_management",
      "workflow_automation",
      "note_taking"
    ],
    "category": "AI Project Management",
    "tags": ["product_manager", "startup_founder", "content_writer"]
  },
  {
    "name": "ClickUp AI",
    "description": "AI features built into ClickUp project management. Writes task descriptions, summarizes docs, and generates project plans.",
    "url": "https://clickup.com",
    "pricing": "Freemium",
    "platform": "Web, Desktop, Mobile",
    "verified_use_cases": [
      "task_management",
      "summarization",
      "long_form_writing"
    ],
    "category": "AI Project Management",
    "tags": ["product_manager", "startup_founder", "software_engineer"]
  },
  {
    "name": "Liner AI",
    "description": "AI research highlighter and summarizer. Highlights web content and asks questions about saved articles and PDFs.",
    "url": "https://liner.app",
    "pricing": "Freemium",
    "platform": "Web, Plugin",
    "verified_use_cases": ["research", "summarization", "knowledge_management"],
    "category": "AI Research",
    "tags": ["content_writer", "data_analyst", "product_manager"]
  },
  {
    "name": "Fireflies.ai",
    "description": "AI meeting assistant that records, transcribes, and generates summaries and action items from any video call.",
    "url": "https://fireflies.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "meeting_summarization",
      "transcription",
      "note_taking"
    ],
    "category": "AI Productivity",
    "tags": ["product_manager", "marketer", "software_engineer"]
  },
  {
    "name": "Magical",
    "description": "AI text expander and workflow automation tool for Chrome. Reduces repetitive typing and automates data entry tasks.",
    "url": "https://getmagical.com",
    "pricing": "Freemium",
    "platform": "Plugin",
    "verified_use_cases": [
      "workflow_automation",
      "email_writing",
      "task_management"
    ],
    "category": "AI Automation",
    "tags": ["marketer", "software_engineer"]
  },
  {
    "name": "Glean",
    "description": "Enterprise AI search tool that connects to your entire app stack and surfaces relevant information from Slack, Drive, and more.",
    "url": "https://glean.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["knowledge_management", "research", "summarization"],
    "category": "AI Productivity",
    "tags": ["product_manager", "software_engineer", "data_analyst"]
  },
  {
    "name": "Merlin AI",
    "description": "AI Chrome extension that brings ChatGPT capabilities to any website. Summarizes articles, writes emails, and answers questions inline.",
    "url": "https://merlin.foyer.work",
    "pricing": "Freemium",
    "platform": "Plugin",
    "verified_use_cases": ["summarization", "email_writing", "research"],
    "category": "AI Productivity",
    "tags": ["content_writer", "marketer", "software_engineer"]
  }
]
```

#### GROUP F — AI Marketing & SEO (16 tools)

```json
[
  {
    "name": "Surfer SEO",
    "description": "AI-powered SEO content optimization tool. Analyzes top-ranking pages and gives real-time writing recommendations for SERP performance.",
    "url": "https://surferseo.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "seo_optimization",
      "seo_writing",
      "blog_writing",
      "competitive_analysis"
    ],
    "category": "AI SEO",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Clearscope",
    "description": "AI content optimization platform used by enterprise SEO teams. Provides keyword research and content grading in real time.",
    "url": "https://clearscope.io",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "seo_optimization",
      "seo_writing",
      "competitive_analysis"
    ],
    "category": "AI SEO",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "MarketMuse",
    "description": "AI content strategy and research platform. Identifies content gaps and builds topical authority plans for SEO growth.",
    "url": "https://marketmuse.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "seo_optimization",
      "research",
      "blog_writing",
      "competitive_analysis"
    ],
    "category": "AI SEO",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Semrush AI",
    "description": "All-in-one SEO and digital marketing platform with AI writing, keyword research, backlink analysis, and competitive intelligence.",
    "url": "https://semrush.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "seo_optimization",
      "competitive_analysis",
      "analytics",
      "seo_writing"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "AdCreative.ai",
    "description": "AI ad creative generator that produces conversion-optimized banner ads, social ads, and display creatives at scale.",
    "url": "https://adcreative.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "ad_creation",
      "graphic_design",
      "social_media_writing"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "graphic_designer"]
  },
  {
    "name": "Predis.ai",
    "description": "AI social media content generator. Creates posts, carousels, videos, and scheduling from a single content brief.",
    "url": "https://predis.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "social_media_writing",
      "ad_creation",
      "content_repurposing"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Buffer AI",
    "description": "Social media management platform with AI assistant for content ideation, caption writing, and optimal scheduling.",
    "url": "https://buffer.com",
    "pricing": "Freemium",
    "platform": "Web, Mobile",
    "verified_use_cases": [
      "social_media_writing",
      "social_media_management",
      "scheduling"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "content_writer", "startup_founder"]
  },
  {
    "name": "Taplio",
    "description": "AI LinkedIn growth tool that generates personal brand content, schedules posts, and analyzes post performance.",
    "url": "https://taplio.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "social_media_writing",
      "lead_generation",
      "personal_branding"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "startup_founder", "content_writer"]
  },
  {
    "name": "Instantly AI",
    "description": "AI cold email platform for automated outreach at scale. Includes inbox warm-up, A/B testing, and AI reply personalization.",
    "url": "https://instantly.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "email_marketing",
      "lead_generation",
      "email_writing"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "startup_founder"]
  },
  {
    "name": "Smartly.io",
    "description": "Enterprise AI platform for automating creative testing and media buying across Facebook, Google, and TikTok ads.",
    "url": "https://smartly.io",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "ad_creation",
      "analytics",
      "social_media_management"
    ],
    "category": "AI Marketing",
    "tags": ["marketer"]
  },
  {
    "name": "HubSpot AI",
    "description": "AI tools embedded across HubSpot CRM: content generation, predictive lead scoring, and AI-powered email campaign tools.",
    "url": "https://hubspot.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "email_marketing",
      "lead_generation",
      "analytics",
      "copywriting"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "startup_founder"]
  },
  {
    "name": "Klaviyo AI",
    "description": "AI-powered email and SMS marketing platform for eCommerce. Includes predictive analytics, segmentation, and AI content generation.",
    "url": "https://klaviyo.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["email_marketing", "analytics", "funnel_building"],
    "category": "AI Marketing",
    "tags": ["marketer"]
  },
  {
    "name": "Typeform AI",
    "description": "AI-powered forms and survey tool. Generates form logic, analyzes responses, and creates insights automatically.",
    "url": "https://typeform.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["lead_generation", "funnel_building", "analytics"],
    "category": "AI Marketing",
    "tags": ["marketer", "product_manager"]
  },
  {
    "name": "Loomly",
    "description": "Social media management platform with AI content suggestions, brand guidelines, and multi-channel publishing.",
    "url": "https://loomly.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "social_media_management",
      "social_media_writing",
      "scheduling"
    ],
    "category": "AI Marketing",
    "tags": ["marketer", "content_writer"]
  },
  {
    "name": "Persado",
    "description": "Enterprise AI platform that generates emotionally intelligent marketing language for email, ads, and web copy.",
    "url": "https://persado.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["copywriting", "email_marketing", "ad_creation"],
    "category": "AI Marketing",
    "tags": ["marketer"]
  },
  {
    "name": "Unbounce Smart Copy",
    "description": "AI writing and landing page generation tool. Builds optimized landing pages and A/B tests copy variants with AI.",
    "url": "https://unbounce.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["landing_page", "copywriting", "funnel_building"],
    "category": "AI Marketing",
    "tags": ["marketer", "startup_founder"]
  }
]
```

#### GROUP G — AI Data & Analytics (10 tools)

```json
[
  {
    "name": "Julius AI",
    "description": "AI data analyst that reads CSV, Excel, and database files and generates charts, insights, and Python code from natural language queries.",
    "url": "https://julius.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "analytics",
      "data_extraction",
      "reporting",
      "research"
    ],
    "category": "AI Data & Analytics",
    "tags": ["data_analyst", "product_manager", "marketer"]
  },
  {
    "name": "Akkio",
    "description": "No-code AI platform for building predictive models and data visualizations from spreadsheet data. Designed for non-data-scientists.",
    "url": "https://akkio.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["analytics", "reporting", "trend_analysis"],
    "category": "AI Data & Analytics",
    "tags": ["data_analyst", "marketer"]
  },
  {
    "name": "Obviously AI",
    "description": "One-click predictive AI for business analysts. Uploads a dataset and generates predictions with accuracy metrics in minutes.",
    "url": "https://obviously.ai",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["analytics", "trend_analysis", "reporting"],
    "category": "AI Data & Analytics",
    "tags": ["data_analyst", "marketer"]
  },
  {
    "name": "Rows AI",
    "description": "AI-powered spreadsheet tool. Combines a traditional spreadsheet interface with AI that writes formulas and generates charts from prompts.",
    "url": "https://rows.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["analytics", "data_extraction", "reporting"],
    "category": "AI Data & Analytics",
    "tags": ["data_analyst", "marketer", "product_manager"]
  },
  {
    "name": "Luminar Neo",
    "description": "AI photo editing software with sky replacement, portrait enhancement, and relighting tools for professional photographers.",
    "url": "https://skylum.com/luminar-neo",
    "pricing": "Paid",
    "platform": "Desktop",
    "verified_use_cases": ["photo_editing", "image_generation"],
    "category": "AI Design",
    "tags": ["graphic_designer", "marketer"]
  },
  {
    "name": "ThoughtSpot Sage",
    "description": "AI-powered analytics search tool for enterprise BI. Ask natural language questions about your data and get instant visual answers.",
    "url": "https://thoughtspot.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["analytics", "reporting", "data_extraction"],
    "category": "AI Data & Analytics",
    "tags": ["data_analyst", "product_manager"]
  },
  {
    "name": "Browse AI",
    "description": "No-code web scraping and monitoring tool. Trains robots to extract data from any website without writing code.",
    "url": "https://browse.ai",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "web_scraping",
      "data_extraction",
      "competitive_analysis"
    ],
    "category": "AI Data & Analytics",
    "tags": ["marketer", "data_analyst", "software_engineer"]
  },
  {
    "name": "Apify",
    "description": "Cloud platform for web scraping and browser automation. Marketplace of 1500+ pre-built scraping actors for common sites.",
    "url": "https://apify.com",
    "pricing": "Freemium",
    "platform": "Web, API",
    "verified_use_cases": [
      "web_scraping",
      "data_extraction",
      "workflow_automation"
    ],
    "category": "AI Data & Analytics",
    "tags": ["software_engineer", "data_analyst", "marketer"]
  },
  {
    "name": "Polymer",
    "description": "AI-powered BI tool that turns spreadsheets into interactive dashboards. No SQL or coding required.",
    "url": "https://polymersearch.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["analytics", "data_visualization", "reporting"],
    "category": "AI Data & Analytics",
    "tags": ["data_analyst", "marketer", "product_manager"]
  },
  {
    "name": "Causal",
    "description": "AI financial modeling and scenario planning tool. Builds dynamic financial models with natural language and visual formulas.",
    "url": "https://causal.app",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["analytics", "reporting", "trend_analysis"],
    "category": "AI Data & Analytics",
    "tags": ["startup_founder", "data_analyst", "product_manager"]
  }
]
```

#### GROUP H — AI Customer Support (5 tools)

```json
[
  {
    "name": "Intercom Fin",
    "description": "AI customer support agent by Intercom. Resolves complex support tickets using GPT-4 with zero hallucination guardrails.",
    "url": "https://intercom.com/fin",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": ["workflow_automation", "knowledge_management"],
    "category": "AI Customer Support",
    "tags": ["startup_founder", "marketer", "product_manager"]
  },
  {
    "name": "Tidio AI",
    "description": "AI chatbot and live chat platform for eCommerce. Answers customer queries 24/7 using your product catalog and knowledge base.",
    "url": "https://tidio.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": ["workflow_automation", "lead_generation"],
    "category": "AI Customer Support",
    "tags": ["marketer", "startup_founder"]
  },
  {
    "name": "Zendesk AI",
    "description": "AI-powered customer service platform. Auto-routes tickets, drafts replies, and summarizes conversation history for agents.",
    "url": "https://zendesk.com",
    "pricing": "Paid",
    "platform": "Web",
    "verified_use_cases": [
      "workflow_automation",
      "summarization",
      "knowledge_management"
    ],
    "category": "AI Customer Support",
    "tags": ["product_manager", "startup_founder"]
  },
  {
    "name": "Freshdesk Freddy AI",
    "description": "Freddy AI within Freshdesk automates ticket resolution, suggests responses, and surfaces knowledge base articles for agents.",
    "url": "https://freshdesk.com",
    "pricing": "Freemium",
    "platform": "Web",
    "verified_use_cases": [
      "workflow_automation",
      "knowledge_management",
      "summarization"
    ],
    "category": "AI Customer Support",
    "tags": ["product_manager", "startup_founder"]
  },
  {
    "name": "Bland AI",
    "description": "AI phone call automation platform. Makes and receives phone calls using a conversational AI voice agent.",
    "url": "https://bland.ai",
    "pricing": "Paid",
    "platform": "API",
    "verified_use_cases": ["workflow_automation", "lead_generation"],
    "category": "AI Customer Support",
    "tags": ["marketer", "startup_founder", "software_engineer"]
  }
]
```

---

## SECTION 4 — ADDITIONAL WORKFLOWS TO SEED (20 total including existing 5)

Add these 15 new workflows to `src/scripts/data/workflows.json`:

```json
[
  {
    "title": "Building a Next.js App with Supabase Auth and Database",
    "description": "End-to-end workflow for bootstrapping a production-ready Next.js application using Supabase for auth and PostgreSQL database.",
    "complexity": "Intermediate",
    "use_cases": [
      "frontend_development",
      "backend_development",
      "database_design"
    ],
    "steps": [
      "Create a new Next.js 14 project with App Router: `npx create-next-app@latest my-app --typescript --tailwind --app`",
      "Install Supabase client: `npm install @supabase/supabase-js @supabase/ssr`",
      "Create a Supabase project at supabase.com and copy your URL and anon key to `.env.local`",
      "Create `utils/supabase/server.ts` and `utils/supabase/client.ts` using the Supabase SSR package helpers",
      "Set up middleware.ts at the root to refresh auth sessions on every request",
      "Create a `/login` route with a Server Action that calls `supabase.auth.signInWithPassword()`",
      "Protect routes by checking `supabase.auth.getUser()` in your layouts or page components",
      "Create database tables in Supabase dashboard with Row Level Security (RLS) enabled",
      "Use Supabase's generated TypeScript types by running: `npx supabase gen types typescript --project-id YOUR_ID > types/supabase.ts`",
      "Deploy to Vercel and add your Supabase environment variables in the Vercel dashboard"
    ],
    "recommended_tools": ["Cursor", "Bolt.new", "GitHub Copilot", "Vercel v0"]
  },
  {
    "title": "AI-Assisted Blog Content Pipeline for SEO",
    "description": "A repeatable workflow for producing high-ranking, AI-assisted blog content from keyword research to published post.",
    "complexity": "Beginner",
    "use_cases": ["seo_writing", "blog_writing", "content_repurposing"],
    "steps": [
      "Use Semrush AI or Surfer SEO to identify a target keyword with good search volume and low difficulty",
      "Run a SERP analysis: open the top 5 ranking pages and note their headings, word count, and subtopics covered",
      "Use Perplexity AI to research your topic and gather factual supporting information with citations",
      "Write a content brief in Notion or Google Docs: target keyword, audience intent, key sections, word count target",
      "Use ChatGPT or Claude with the brief as context to generate a first draft outline, then expand each section",
      "Paste your draft into Surfer SEO's Content Editor and optimize for NLP keywords and content score",
      "Run the draft through Grammarly and Hemingway Editor for grammar, clarity, and readability checks",
      "Add original visuals using Canva Magic Studio or generate supporting images with Midjourney",
      "Schedule the post using your CMS and set up internal links to related content",
      "After publishing, monitor rankings weekly and update the post with Surfer SEO every 3–6 months"
    ],
    "recommended_tools": [
      "Surfer SEO",
      "Perplexity AI",
      "Claude",
      "ChatGPT",
      "GrammarlyGO",
      "Canva Magic Studio"
    ]
  },
  {
    "title": "Creating a Brand Identity from Scratch with AI",
    "description": "A structured workflow for building a complete visual brand identity using AI design tools.",
    "complexity": "Beginner",
    "use_cases": ["brand_identity", "logo_design", "graphic_design"],
    "steps": [
      "Define your brand: write a one-paragraph brand brief covering your audience, tone, values, and key differentiators",
      "Use ChatGPT to generate 5 brand name options based on your brief, then check domain availability",
      "Use Looka or Midjourney to generate logo concepts — iterate with prompts like: `minimal wordmark logo, teal and charcoal, sans-serif, modern tech brand`",
      "Use Khroma to generate 5 colour palette options based on your brand mood and select one",
      "Define your typography: use Google Fonts and AI to pair a heading font with a body font",
      "Create brand pattern/texture assets using Adobe Firefly's generative fill",
      "Build a brand guidelines document in Canva Magic Studio including: logo usage rules, colour codes, typography scale",
      "Design your first set of social media templates in Canva or Figma using the brand kit",
      "Export all assets as SVG (logo), PNG (social assets), and a brand guide PDF"
    ],
    "recommended_tools": [
      "Looka",
      "Midjourney",
      "Canva Magic Studio",
      "Adobe Firefly",
      "Khroma",
      "ChatGPT"
    ]
  },
  {
    "title": "Automated Social Media Content Calendar with AI",
    "description": "Build a month's worth of social content in one session using AI tools, then schedule it automatically.",
    "complexity": "Beginner",
    "use_cases": ["social_media_writing", "content_repurposing", "scheduling"],
    "steps": [
      "Define your content pillars (e.g. education, behind-the-scenes, promotion, community) — aim for 4–5 pillars",
      "Use ChatGPT to generate 30 post ideas across your pillars based on your niche and audience",
      "Group posts by pillar and assign them to dates in a spreadsheet or Notion calendar",
      "Use Jasper or Copy.ai to write captions for each post, specifying platform tone (LinkedIn vs Instagram vs Twitter)",
      "Generate visuals for each post: use Canva Magic Studio for designed graphics, Midjourney for lifestyle images",
      "Use Opus Clip to repurpose any existing video content into short-form clips for Reels/TikTok",
      "Review and edit all content for brand voice consistency using Grammarly",
      "Upload and schedule all content using Buffer AI or Loomly",
      "After 2 weeks, review analytics in your social platform and note what content performed best"
    ],
    "recommended_tools": [
      "ChatGPT",
      "Jasper",
      "Canva Magic Studio",
      "Midjourney",
      "Opus Clip",
      "Buffer AI"
    ]
  },
  {
    "title": "Setting Up a Vector Database for RAG (Retrieval-Augmented Generation)",
    "description": "Step-by-step guide to building a document Q&A system using embeddings and a vector database.",
    "complexity": "Advanced",
    "use_cases": ["backend_development", "api_development", "database_design"],
    "steps": [
      "Choose your embedding model: OpenAI `text-embedding-3-small` (cost-effective) or a local model via Ollama",
      "Choose your vector database: Pinecone (managed), Qdrant (open-source hosted), or pgvector (PostgreSQL extension)",
      "Chunk your documents: split text into 500–1000 token chunks with 10–20% overlap to preserve context",
      "Generate embeddings for each chunk using the OpenAI Embeddings API and store with metadata (source, page, chunk_id)",
      "Upsert all vectors into your chosen vector database with associated metadata",
      "At query time: embed the user's question with the same model, then run a similarity search (top_k=5)",
      "Retrieve the top matching chunks and inject them into your LLM prompt as context",
      "Use a system prompt like: 'Answer based ONLY on the provided context. If the context doesn't contain the answer, say so.'",
      "Implement a re-ranking step with a cross-encoder model (Cohere Rerank) for higher precision on critical queries",
      "Monitor hallucination rate and retrieval quality by logging queries and rating answers"
    ],
    "recommended_tools": ["GitHub Copilot", "Cursor", "Perplexity AI", "Claude"]
  },
  {
    "title": "Podcast Production Workflow with AI",
    "description": "End-to-end podcast production pipeline from recording to published, distributed episode using AI tools.",
    "complexity": "Beginner",
    "use_cases": ["podcast_production", "transcription", "content_repurposing"],
    "steps": [
      "Record your episode using a USB microphone; aim for a quiet room with soft furnishings to reduce echo",
      "Upload the raw audio to Adobe Podcast (Enhance Speech) to remove background noise and improve voice clarity — it's free",
      "Import the cleaned audio into Descript; the transcript is auto-generated within minutes",
      "Edit by deleting words and filler sounds (`um`, `uh`) directly in the transcript view",
      "Use Descript's Overdub to fix mispronounced words without re-recording",
      "Export the final audio as MP3 and the transcript as a text file",
      "Paste the transcript into ChatGPT or Claude to generate: episode title, show notes, chapter timestamps, and 5 social media posts",
      "Use Opus Clip on the video version (if recorded) to extract 3–5 short clips for promotion",
      "Create an episode cover using Canva Magic Studio with your podcast brand kit",
      "Upload to your podcast host (Spotify for Podcasters, Buzzsprout) and publish with the AI-generated metadata"
    ],
    "recommended_tools": [
      "Adobe Podcast (Enhance Speech)",
      "Descript",
      "ChatGPT",
      "Opus Clip",
      "Canva Magic Studio"
    ]
  },
  {
    "title": "UI/UX Design Sprint Workflow with AI",
    "description": "A one-week AI-assisted design sprint for shipping a validated product interface from concept to prototype.",
    "complexity": "Intermediate",
    "use_cases": ["ui_design", "prototyping", "user_research"],
    "steps": [
      "Day 1 — Define: Write a product brief covering the user problem, target persona, and success metric. Use ChatGPT to stress-test your assumptions.",
      "Day 1 — Competitive Audit: Use Perplexity AI to research 5 competitors. Document what works and what doesn't.",
      "Day 2 — Sitemap: Use Relume to generate a sitemap and page structure from your brief in minutes.",
      "Day 2 — Wireframes: Import the Relume sitemap into Figma. Use Uizard to flesh out wireframes from rough sketches.",
      "Day 3 — Component Design: Build out your component library in Figma using an AI design system (e.g. Untitled UI). Use Figma AI for layout suggestions.",
      "Day 4 — High-Fidelity: Apply your brand colours, typography, and assets. Use Adobe Firefly to generate supporting imagery.",
      "Day 4 — Prototype: Connect screens in Figma with smart animations and micro-interactions.",
      "Day 5 — Validate: Share the prototype via Figma link with 5 real users. Use Otter.ai to transcribe feedback sessions.",
      "Day 5 — Iterate: Address the top 3 usability issues found in testing before handing off to engineering."
    ],
    "recommended_tools": [
      "Figma AI",
      "Relume",
      "Uizard",
      "Adobe Firefly",
      "ChatGPT",
      "Otter.ai",
      "Perplexity AI"
    ]
  },
  {
    "title": "Cold Email Outreach Campaign with AI",
    "description": "Build and launch a personalized cold email campaign from prospect list to booked calls using AI.",
    "complexity": "Intermediate",
    "use_cases": ["email_marketing", "lead_generation", "email_writing"],
    "steps": [
      "Define your ICP (Ideal Customer Profile): industry, company size, job title, geography, and tech stack signals",
      "Use Browse AI or Apollo.io to scrape and build a prospect list of 200–500 targeted leads with email addresses",
      "Validate and clean your email list using a tool like NeverBounce or ZeroBounce to remove invalid addresses",
      "Warm up your sending domain using Instantly AI's inbox warm-up feature for 2 weeks before launching",
      "Write 3 email sequence variants (A/B/C): use Claude or ChatGPT with a prompt like: 'Write a cold email for [persona] about [offer]. Max 100 words. No buzzwords. Add a clear single CTA.'",
      "Personalize the first line of each email using AI to reference the prospect's recent LinkedIn post or company news",
      "Load your sequence into Instantly AI and set up automated follow-ups at Day 3 and Day 7 for non-openers",
      "Track open rates, reply rates, and booked meetings. Target: 40%+ open rate, 5%+ reply rate",
      "For replied leads, use Superhuman AI to draft personalized responses quickly"
    ],
    "recommended_tools": [
      "Instantly AI",
      "ChatGPT",
      "Claude",
      "Browse AI",
      "Superhuman AI"
    ]
  },
  {
    "title": "Building a Docker-Containerized Node.js Microservice",
    "description": "Containerize and deploy a Node.js API service using Docker and Docker Compose for local development and production.",
    "complexity": "Intermediate",
    "use_cases": ["backend_development", "infrastructure", "deployment"],
    "steps": [
      "Create a `Dockerfile` in your project root: use `node:20-alpine` as base image, `WORKDIR /app`, `COPY package*.json ./`, `RUN npm ci --only=production`, `COPY . .`, `EXPOSE 3000`, `CMD [\"node\", \"dist/server.js\"]`",
      "Add a `.dockerignore` file: include `node_modules`, `.env`, `dist`, `.git`, and `*.log`",
      "Create a `docker-compose.yml` with your service, a MongoDB container, and a Redis container — all on a shared network",
      "Set environment variables in a `docker-compose.env` file (never commit this) and reference with `env_file` in compose",
      "Add a health check to your Node service in docker-compose using `curl -f http://localhost:3000/health`",
      "Build and run locally: `docker-compose up --build` and verify the health endpoint responds",
      "Use multi-stage builds in your Dockerfile: `builder` stage compiles TypeScript, `runner` stage copies only `dist/`",
      "For production: push your image to Docker Hub or a private registry (ECR, GCR, Artifact Registry)",
      "Deploy using your cloud provider's container service (Railway, Render, AWS ECS, or Fly.io)"
    ],
    "recommended_tools": ["GitHub Copilot", "Cursor", "Warp"]
  },
  {
    "title": "Product Launch Content Package with AI",
    "description": "Create a complete content package for a product launch in one focused session using AI tools.",
    "complexity": "Beginner",
    "use_cases": [
      "copywriting",
      "social_media_writing",
      "email_writing",
      "presentation_design"
    ],
    "steps": [
      "Write a one-page product brief: what it is, who it's for, the top 3 benefits, pricing, and launch date",
      "Use Claude to generate the core messaging framework: headline, subheadline, 3 benefit statements, and a CTA",
      "Use Jasper or Copy.ai to generate 5 variations of your launch email with different subject lines — A/B test later",
      "Use ChatGPT to write a launch announcement for each platform: LinkedIn (professional), Twitter/X (casual + punchy), and Instagram (visual-first caption)",
      "Use Gamma or Beautiful.ai to create a launch deck with your messaging, screenshots, and pricing",
      "Design launch graphics in Canva Magic Studio: hero banner, social square, and story format",
      "Generate product screenshot enhancements using Screely or AppMockup",
      "Use Synthesia or HeyGen to record a 60-second AI video product demo",
      "Write a Product Hunt launch post using the headline and benefit framework already created",
      "Schedule all content in Buffer AI for coordinated launch-day posting"
    ],
    "recommended_tools": [
      "Claude",
      "Jasper",
      "Gamma",
      "Canva Magic Studio",
      "Synthesia",
      "Buffer AI"
    ]
  },
  {
    "title": "AI-Assisted Code Review Workflow",
    "description": "A structured workflow for using AI to perform thorough code reviews, catch bugs, and improve code quality.",
    "complexity": "Intermediate",
    "use_cases": ["code_review", "debugging", "documentation"],
    "steps": [
      "Before review: ensure the PR has a clear description, screenshots if UI changes, and linked ticket/issue",
      "Use GitHub Copilot's code review feature or Cursor's AI chat to get an initial automated review of the diff",
      "Paste the key changed functions into Claude with the prompt: 'Review this code for: security vulnerabilities, edge cases, performance issues, and adherence to SOLID principles. Be specific.'",
      "Check for: SQL injection risks, unhandled promise rejections, missing input validation, hardcoded credentials",
      "Use Sourcegraph Cody to understand how the changed code interacts with the rest of the codebase",
      "Generate missing unit tests with GitHub Copilot: highlight the function and ask 'Write unit tests for this function covering happy path, edge cases, and error states'",
      "Use a linter and Prettier (pre-configured) to enforce style — never leave style issues in code review comments",
      "Leave actionable review comments using the pattern: 'Suggestion: [what to change] because [reason]. Example: [code snippet]'",
      "For architectural concerns, schedule a 15-minute sync rather than a long back-and-forth in comments"
    ],
    "recommended_tools": [
      "GitHub Copilot",
      "Cursor",
      "Claude",
      "Sourcegraph Cody"
    ]
  },
  {
    "title": "Converting YouTube/Podcast Content into a Blog Post with AI",
    "description": "A fast workflow for repurposing long-form audio/video content into high-quality written content.",
    "complexity": "Beginner",
    "use_cases": ["content_repurposing", "blog_writing", "seo_writing"],
    "steps": [
      "Get the transcript: use Otter.ai, Descript, or YouTube's built-in transcript (three dots under the video → Open transcript)",
      "Clean the raw transcript: paste it into ChatGPT with the prompt: 'Clean this transcript by removing filler words, fixing punctuation, and breaking it into paragraphs. Keep all original ideas.'",
      "Ask Claude to identify the 5 most valuable insights in the transcript that would make a good blog post",
      "Choose the best insight and write a blog post brief: target keyword, audience, headline, and 4 key sections",
      "Use Claude or ChatGPT to draft the full blog post based on the brief + relevant transcript excerpts",
      "Optimize the draft in Surfer SEO's Content Editor for your target keyword",
      "Add a pull quote section and a TL;DR summary at the top for skimmers",
      "Generate a featured image using Midjourney or Canva Magic Studio",
      "Publish and cross-link to 2–3 existing posts on your site for SEO boost"
    ],
    "recommended_tools": [
      "Otter.ai",
      "ChatGPT",
      "Claude",
      "Surfer SEO",
      "Canva Magic Studio"
    ]
  },
  {
    "title": "Setting Up a TypeScript Monorepo with Turborepo",
    "description": "Configure a scalable TypeScript monorepo using Turborepo for managing multiple apps and shared packages.",
    "complexity": "Advanced",
    "use_cases": [
      "frontend_development",
      "backend_development",
      "infrastructure"
    ],
    "steps": [
      "Scaffold with: `npx create-turbo@latest` — choose the npm workspaces template",
      "Understand the structure: `apps/` (web, api, mobile) and `packages/` (ui, config, utils, types)",
      "Configure `turbo.json` with a pipeline: `build` depends on `^build`, `dev` runs in parallel, `lint` and `test` are independent",
      "Extract shared TypeScript config into `packages/tsconfig`: create `base.json`, `nextjs.json`, and `node.json`",
      "Create a shared `packages/ui` component library: export reusable React components consumed by all `apps/`",
      "Set up a shared `packages/types` for cross-service TypeScript interfaces (important for API contracts)",
      "Install and configure ESLint in a shared `packages/eslint-config` package that all apps extend",
      "Add `changesets` for versioning shared packages: `npm install -D @changesets/cli` and `npx changeset init`",
      "Set up GitHub Actions to run `turbo run build lint test` with caching on every PR",
      "For local dev: `turbo dev` runs all apps in parallel with hot reload and shared package watching"
    ],
    "recommended_tools": ["GitHub Copilot", "Cursor", "Warp", "Claude"]
  },
  {
    "title": "AI Data Analysis and Reporting Workflow",
    "description": "A workflow for non-data-scientists to analyze datasets and produce business-ready reports using AI tools.",
    "complexity": "Beginner",
    "use_cases": ["analytics", "reporting", "data_extraction"],
    "steps": [
      "Export your data as CSV from your source (Google Sheets, CRM, analytics platform)",
      "Upload to Julius AI and describe what you want to understand: 'Show me revenue by month with a trend line'",
      "Ask Julius follow-up questions in plain English: 'Which product category had the highest growth in Q2?'",
      "Export the generated charts as PNG or the analysis as a PDF report",
      "For deeper pattern analysis, upload the CSV to Claude with the prompt: 'Identify the 3 most surprising insights in this dataset and suggest 2 business actions based on each'",
      "Use Rows AI to build a live dashboard that auto-updates when the source spreadsheet changes",
      "Use Gamma to turn your key findings and charts into a presentation-ready report deck",
      "Schedule a recurring export and analysis pipeline using Zapier Central to automate weekly reporting"
    ],
    "recommended_tools": [
      "Julius AI",
      "Claude",
      "Rows AI",
      "Gamma",
      "Zapier Central (Zapier AI)"
    ]
  },
  {
    "title": "Building an AI-Powered Internal Tool with No-Code",
    "description": "Workflow for building an internal business tool (dashboard, form, workflow) using AI no-code platforms.",
    "complexity": "Intermediate",
    "use_cases": [
      "workflow_automation",
      "frontend_development",
      "data_extraction"
    ],
    "steps": [
      "Define the tool's purpose in one sentence: e.g. 'A dashboard that shows our support ticket backlog and allows tagging by priority'",
      "Choose your no-code platform: Retool (data-heavy dashboards), Glide (mobile-first), or Webflow (public-facing)",
      "Connect your data source: most platforms support REST APIs, Airtable, PostgreSQL, Supabase, or Google Sheets natively",
      "Use Relevance AI to add an AI action layer: e.g. auto-classify new entries, generate summaries, suggest responses",
      "Build the UI components: tables, forms, buttons, and charts using drag-and-drop",
      "Use Zapier Central to automate the data flow: e.g. 'When a new row is added to Airtable, send a Slack notification and run the AI classifier'",
      "Set up role-based access control to restrict data visibility by team",
      "Test with 3 real users from the target team, collect feedback, and iterate",
      "Deploy and document: write a short usage guide using Notion AI"
    ],
    "recommended_tools": [
      "Relevance AI",
      "Zapier Central (Zapier AI)",
      "Notion AI",
      "ChatGPT"
    ]
  }
]
```

---

## SECTION 5 — ADDITIONAL SOLUTIONS TO SEED (15 total including existing 4)

Add these 11 new solutions to `src/scripts/data/solutions.json`:

```json
[
  {
    "issue_title": "API Rate Limiting: 429 Too Many Requests Error",
    "description": "Your application is hitting rate limits from a third-party API, causing intermittent 429 errors and failed requests.",
    "tags": ["api", "backend", "rate-limiting", "node.js"],
    "cause_explanation": "Rate limit errors occur when your application sends too many requests to an API within the provider's allowed window (e.g. 60 requests/minute). Common causes: no throttling in loops, no exponential backoff on retry, multiple instances all hitting the same API key simultaneously.",
    "resolution_steps": [
      "Identify the rate limit: check the API docs and inspect response headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`)",
      "Implement a request queue using a library like `bottleneck` (Node.js): `const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 1000 });`",
      "Add exponential backoff on retry: wait 1s, then 2s, then 4s, then 8s before each retry attempt (max 3 retries)",
      "Cache API responses where the data doesn't change frequently (use Redis with a TTL matching the data freshness requirement)",
      "If multiple app instances share one API key, centralize rate limiting via a shared Redis counter rather than per-instance memory",
      "For bulk operations, implement batching: group requests and process in chunks respecting the rate limit window"
    ],
    "tradeoffs": "Queueing and backoff adds latency to user-facing requests. Consider making rate-limited operations asynchronous (background job queue) rather than blocking the request-response cycle.",
    "recommended_tools": ["GitHub Copilot", "Cursor", "Claude"]
  },
  {
    "issue_title": "MongoDB Atlas Slow Queries: Diagnosing and Fixing Performance Issues",
    "description": "Queries are taking too long (>100ms) causing high latency on API endpoints backed by MongoDB Atlas.",
    "tags": ["mongodb", "database", "performance", "backend"],
    "cause_explanation": "Slow queries in MongoDB are almost always caused by one of: missing indexes (COLLSCAN instead of IXSCAN), returning too many documents without pagination, fetching unnecessary fields (no projection), or N+1 query patterns in application code.",
    "resolution_steps": [
      "Enable Atlas Performance Advisor: go to Atlas Dashboard → Performance Advisor to see auto-detected slow queries",
      "Run `explain('executionStats')` on your slow query: look for `COLLSCAN` (bad) vs `IXSCAN` (good) and check `totalDocsExamined` vs `nReturned`",
      "Add a compound index on fields used together in queries: `db.collection.createIndex({ status: 1, createdAt: -1 })` — order matters",
      "Always add pagination: use `.skip()` and `.limit()` or cursor-based pagination (more efficient at scale) — never return unbounded results",
      "Use projections: `findOne({ _id: id }, { password: 0, __v: 0 })` to exclude heavy fields you don't need",
      "Fix N+1 patterns: use `.populate()` in Mongoose carefully — for bulk lookups, use `$lookup` in an aggregation pipeline instead",
      "Add a TTL index if you're storing temporary data: `createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })`"
    ],
    "tradeoffs": "Indexes speed up reads but slow down writes and consume storage. Don't index every field — only fields used in query filters, sorts, and aggregation `$match` stages.",
    "recommended_tools": ["Claude", "GitHub Copilot", "Cursor"]
  },
  {
    "issue_title": "Vercel Deployment Fails: Build Errors and Environment Variable Issues",
    "description": "Your Next.js or Node.js app fails to build or behaves differently in Vercel production vs local development.",
    "tags": ["vercel", "deployment", "next.js", "environment-variables"],
    "cause_explanation": "Vercel build failures commonly stem from: environment variables not being added to the Vercel dashboard, using Node.js APIs not available in Edge Runtime, `__dirname` or `fs` module usage in serverless functions, or build-time vs runtime environment variable access patterns in Next.js.",
    "resolution_steps": [
      "Check build logs in Vercel dashboard first: go to Deployments → click the failed deployment → View Build Logs",
      "Add ALL required environment variables in Vercel Dashboard → Settings → Environment Variables. Check which environments (Production, Preview, Development) each variable applies to.",
      "For Next.js: prefix client-side env vars with `NEXT_PUBLIC_`. Server-side vars have no prefix. Never put secrets in `NEXT_PUBLIC_` vars.",
      "If using `__dirname` or `path.join(__dirname, ...)` in serverless routes: replace with `process.cwd()` or use the `public` directory for static assets",
      "If using Node.js built-ins (fs, child_process): ensure these are in API routes (Node.js runtime), not middleware (Edge Runtime). Set `export const runtime = 'nodejs'` explicitly.",
      "For Vercel Serverless Functions with external files (like JSON seeds): add them to `vercel.json` under `includeFiles`",
      "Test production build locally: `npm run build && npm start` to catch most issues before pushing"
    ],
    "tradeoffs": "Vercel's serverless architecture has cold start latency and a 50MB function size limit. For long-running processes or large dependencies, consider a dedicated server (Railway, Render, Fly.io) instead.",
    "recommended_tools": ["Claude", "GitHub Copilot", "Cursor", "Warp"]
  },
  {
    "issue_title": "React State Not Updating: Stale Closure and Async State Issues",
    "description": "State changes don't appear to trigger re-renders, or you're reading stale values inside event handlers and async callbacks.",
    "tags": ["react", "javascript", "state-management", "frontend"],
    "cause_explanation": "Stale closures occur when a callback captures the value of a state variable at the time it was created, not the current value. This is especially common with `setTimeout`, event listeners added in `useEffect`, and async functions that read state after an `await`.",
    "resolution_steps": [
      "For stale state in event handlers: use the functional update form: `setState(prev => prev + 1)` instead of `setState(count + 1)`",
      "For stale state in async functions: use `useRef` to hold a mutable reference that always reflects the latest value: `const countRef = useRef(count); countRef.current = count;`",
      "For effects that depend on state: add the state variable to the `useEffect` dependency array — the ESLint `react-hooks/exhaustive-deps` rule will catch missing deps",
      "For complex state interactions: move logic to `useReducer` — reducers always receive the latest state as the first argument, eliminating stale closure issues",
      "If objects in state aren't triggering re-renders: ensure you're creating a new reference — `setState({...prev, key: value})` not mutating `prev` directly",
      "Debug by adding `console.log` inside the render function body (not inside effects) to confirm when renders happen"
    ],
    "tradeoffs": "Overusing `useRef` to escape closure issues is a code smell — it makes data flow harder to trace. Prefer restructuring state or using `useReducer` for complex cases.",
    "recommended_tools": ["Cursor", "GitHub Copilot", "Claude"]
  },
  {
    "issue_title": "TypeScript Generic Types: Overcoming Type Inference Failures",
    "description": "TypeScript is widening types unexpectedly, losing type information through generic functions, or giving confusing inference errors.",
    "tags": ["typescript", "development", "types"],
    "cause_explanation": "TypeScript fails to infer precise types in generic functions when: the return type is too broad, conditional types are used without constraints, `as` casting discards useful information, or overloaded functions lose narrowing.",
    "resolution_steps": [
      "Add explicit generic constraints: `<T extends Record<string, unknown>>` instead of `<T>` when you need to access properties",
      "Use `satisfies` (TypeScript 4.9+) instead of `as` for type-safe assertions that preserve the inferred type: `const config = { port: 3000 } satisfies Config`",
      "For discriminated unions: ensure every branch has a literal `type` property. TypeScript will narrow automatically in switch/if blocks.",
      "When function return type is being widened to `string` instead of `'admin' | 'user'`: add `as const` to the return value or constrain with `T extends 'admin' | 'user'`",
      "Use `infer` in conditional types for extracting nested types: `type UnwrapPromise<T> = T extends Promise<infer U> ? U : T`",
      "Enable `strict: true` in tsconfig — this catches most silent type issues at the source"
    ],
    "tradeoffs": "Heavy use of conditional and mapped types makes code harder to read for junior developers. Strike a balance between type safety and code clarity — sometimes a well-named type alias is better than a complex conditional type.",
    "recommended_tools": ["GitHub Copilot", "Cursor", "Claude"]
  },
  {
    "issue_title": "AI Prompt Engineering: Getting Inconsistent Outputs from LLMs",
    "description": "Your prompts to GPT-4, Claude, or Gemini produce unreliable, off-format, or unpredictable outputs that break your application logic.",
    "tags": ["ai", "llm", "prompt-engineering", "development"],
    "cause_explanation": "Inconsistent LLM outputs are caused by: under-specified prompts that leave room for interpretation, missing output format constraints, temperature settings too high for structured tasks, and system prompts that conflict with user prompts.",
    "resolution_steps": [
      "Always specify output format explicitly: 'Respond ONLY in valid JSON with this exact structure: { name: string, score: number }. No markdown, no preamble.'",
      "Set temperature to 0 or 0.1 for structured/deterministic tasks (JSON extraction, classification). Use 0.7–1.0 only for creative tasks.",
      "Use a system prompt for persistent instructions and the user message for variable input — don't mix them",
      "Add a negative instruction: 'Do not include any explanation, markdown formatting, or backticks in your response. Output raw JSON only.'",
      "Implement output validation: parse the JSON and validate against a schema (Zod, Joi, or JSON Schema). If invalid, retry once with an error message in the prompt.",
      "Use few-shot examples in your prompt: show 2–3 input/output examples before the actual input. This dramatically improves consistency.",
      "For critical production use cases: compare outputs from 3 runs and pick the most common answer (majority vote / self-consistency)"
    ],
    "tradeoffs": "Strict format constraints reduce the LLM's ability to express nuance or handle edge cases gracefully. For open-ended tasks, allow some flexibility and handle parsing failures gracefully rather than requiring rigid JSON.",
    "recommended_tools": ["Claude", "ChatGPT", "GitHub Copilot", "Cursor"]
  },
  {
    "issue_title": "CSS Layout Breaks on Mobile: Responsive Design Issues",
    "description": "Your web design looks good on desktop but breaks, overflows, or misaligns on mobile and tablet screen sizes.",
    "tags": ["css", "frontend", "responsive-design", "mobile"],
    "cause_explanation": "Mobile layout issues typically come from: fixed pixel widths overriding fluid layouts, missing viewport meta tag, Flexbox or Grid children not shrinking properly, images without `max-width: 100%`, and font sizes that don't scale.",
    "resolution_steps": [
      "Ensure your HTML `<head>` has: `<meta name='viewport' content='width=device-width, initial-scale=1'>` — without this, mobile browsers render at desktop width",
      "Replace fixed widths with fluid widths: `width: 400px` → `width: min(400px, 100%)` or `max-width: 400px; width: 100%`",
      "For images: add `img { max-width: 100%; height: auto; }` globally to prevent overflow",
      "Debug with Chrome DevTools: click the device toggle (Ctrl+Shift+M) and test at 375px (iPhone SE), 768px (iPad), and 1280px (laptop)",
      "Use CSS Grid with `auto-fill` or `auto-fit` for responsive grids: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`",
      "For Flexbox rows that should stack on mobile: add `flex-wrap: wrap` and set `flex: 0 0 100%` on the item at your breakpoint",
      "Use `clamp()` for responsive typography: `font-size: clamp(1rem, 2.5vw, 1.5rem)` scales smoothly without media queries"
    ],
    "tradeoffs": "Using `vw` and `vh` units for sizing can cause unexpected behavior in browsers with dynamic toolbars (iOS Safari). Use `svh`/`dvh` for full-height layouts on mobile.",
    "recommended_tools": ["Claude", "Vercel v0", "GitHub Copilot", "Cursor"]
  },
  {
    "issue_title": "Git Merge Conflicts: Resolving Without Breaking the Codebase",
    "description": "You're facing frequent or complex merge conflicts when rebasing or merging feature branches in a team environment.",
    "tags": ["git", "version-control", "teamwork", "development"],
    "cause_explanation": "Merge conflicts are inevitable when multiple developers edit the same lines. They become destructive when developers blindly accept one side without understanding both changes, particularly in generated files, package locks, and large refactors.",
    "resolution_steps": [
      "Use a visual merge tool: configure VS Code as your git merge tool: `git config --global merge.tool vscode` and `git config --global mergetool.vscode.cmd 'code --wait $MERGED'`",
      "For each conflict: read BOTH sides carefully before choosing. The `<<<< HEAD` section is your branch; the `>>>> branch-name` section is the incoming branch.",
      "For `package-lock.json` conflicts: never manually edit it. Accept either side, then run `npm install` to regenerate it properly.",
      "Reduce conflicts by using short-lived feature branches (< 2 days). Long-lived branches diverge far from main and create massive conflicts.",
      "Before opening a PR: rebase onto the latest `main` branch with `git fetch origin && git rebase origin/main` to catch conflicts early on your own machine.",
      "After resolving, test the build: run `npm run build` and `npm test` before committing the merge resolution — never commit without verifying it builds.",
      "Use `git rerere` (reuse recorded resolutions): `git config --global rerere.enabled true` — Git will remember how you resolved a conflict and apply it automatically next time"
    ],
    "tradeoffs": "Rebasing rewrites commit history — only rebase on branches you own, never on shared branches like `main` or `dev`. Use merge commits on shared branches to preserve history.",
    "recommended_tools": ["GitHub Copilot", "Cursor", "Warp", "Claude"]
  },
  {
    "issue_title": "Figma Design Handoff Issues: Developers Misinterpreting Designs",
    "description": "Engineers are implementing designs incorrectly — wrong spacing, fonts, colours, or interactive states — leading to back-and-forth rework.",
    "tags": ["figma", "design-handoff", "ui-ux", "collaboration"],
    "cause_explanation": "Handoff issues occur when designs lack specification for states (hover, focus, error, empty), spacing isn't using a consistent grid, components aren't built in Figma as actual components with variants, and designs don't reflect real data (too perfect, no edge cases).",
    "resolution_steps": [
      "Use Figma's Dev Mode: share the design file with developers using the 'Dev Mode' viewer — it shows exact CSS values, spacing, and asset exports",
      "Design all interactive states: every button needs Default, Hover, Active, Focus, and Disabled states as Figma component variants",
      "Use an 8pt spacing grid: all spacing, padding, and margin values should be multiples of 4 or 8 (4, 8, 12, 16, 24, 32, 48px)",
      "Build real components: don't detach instances. Engineers should be able to inspect a component and understand its structure from the Figma sidebar",
      "Add design annotations using the Figma Annotations plugin: mark interaction notes, animation details, and edge cases directly on the canvas",
      "Test designs with real data: use Figma's Content Reel plugin to fill components with real names, long text, and images to expose layout issues before handoff",
      "Create a handoff checklist: before marking designs ready, check — all states designed, spacing uses grid, assets are exportable, error and empty states exist"
    ],
    "tradeoffs": "Highly detailed handoffs require more design time upfront. In fast-moving startups, agree on a minimum viable handoff standard with your team rather than perfect specs every time.",
    "recommended_tools": ["Figma AI", "Relume", "Claude"]
  },
  {
    "issue_title": "Email Deliverability: Emails Landing in Spam Folder",
    "description": "Transactional or marketing emails are going to spam or promotions tabs, reducing open rates and user engagement.",
    "tags": ["email", "marketing", "deliverability", "backend"],
    "cause_explanation": "Email spam classification is triggered by: missing or incorrect SPF, DKIM, and DMARC DNS records, sending from a cold domain without warm-up, high unsubscribe or bounce rates, and suspicious content patterns (too many links, all-image emails, spam trigger words).",
    "resolution_steps": [
      "Check your authentication: run your domain through mail-tester.com for a deliverability score. Target 9+/10.",
      "Set up SPF record: add a TXT record like `v=spf1 include:sendgrid.net ~all` (replace with your ESP's include)",
      "Set up DKIM: your email service provider (Mailgun, Postmark, Sendgrid) provides DKIM keys — add them as TXT records in your DNS",
      "Set up DMARC: add `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com` to start in monitoring mode, then tighten to `p=quarantine`",
      "Warm up new sending domains: start with 20 emails/day to engaged contacts and double weekly for 4–6 weeks before bulk sending",
      "Maintain a clean list: remove hard bounces immediately and unsubscribes within 24 hours. Use double opt-in for new subscribers.",
      "Improve content signals: keep HTML:text ratio balanced, have at least one unsubscribe link, use a custom sending subdomain (mail.yourdomain.com not mail.sendgrid.com)"
    ],
    "tradeoffs": "Aggressive deliverability measures like strict DMARC (`p=reject`) can cause legitimate forwarded emails to be dropped. Start with `p=none`, monitor the DMARC reports for 4 weeks, then tighten.",
    "recommended_tools": ["Claude", "ChatGPT", "Instantly AI"]
  },
  {
    "issue_title": "Video Rendering Slow: Optimizing AI Video Workflows",
    "description": "AI video generation or editing workflows are taking too long or producing quality lower than expected.",
    "tags": ["video", "ai-tools", "optimization", "workflow"],
    "cause_explanation": "Slow AI video generation is caused by: choosing the wrong model tier (quality vs speed), submitting overly long or complex prompts, not leveraging reference images for consistency, and running multiple generation tasks serially instead of in parallel.",
    "resolution_steps": [
      "Use the right model for the task: Runway Gen-3 Alpha Turbo for fast drafts, Gen-3 Alpha for final output. Kling AI is faster for shorter clips.",
      "Write precise video prompts: include camera movement, lighting style, subject action, and duration. Bad: 'a person walking'. Good: 'slow cinematic push-in on a young woman walking through a rainy Tokyo street at night, neon reflections, film grain'",
      "Use a reference image for the first frame: this locks character/scene consistency and dramatically improves output quality",
      "Generate multiple short clips in parallel rather than one long clip sequentially — then stitch in Descript or Veed.io",
      "For AI avatar videos (HeyGen, Synthesia): write scripts under 120 seconds per segment to avoid timeouts and quality degradation",
      "Export at the right resolution for the platform: 1080p for YouTube, 1080x1920 for Reels/TikTok, 1200x628 for LinkedIn — don't over-render",
      "Cache reusable AI-generated B-roll clips in an asset library to avoid regenerating similar content repeatedly"
    ],
    "tradeoffs": "Higher quality video models (Runway Gen-3 Alpha) cost significantly more credits than fast models. Establish a two-tier workflow: fast model for internal drafts, premium model for final client-facing output.",
    "recommended_tools": [
      "Runway Gen-3 Alpha",
      "Descript",
      "Veed.io",
      "HeyGen",
      "Opus Clip"
    ]
  }
]
```

---

## SECTION 6 — SEED SCRIPT HARDENING (CRITICAL)

### 6.1 Make the Seed Idempotent

Rewrite `src/scripts/seed.ts` to be fully idempotent. It must:

1. **Never fail silently** — wrap all operations in try/catch with meaningful error messages
2. **Upsert, don't drop+insert** — use `findOneAndUpdate` with `upsert: true` keyed on `name` for tools, and `title` for workflows/solutions
3. **Validate before insert** — check all required fields exist before attempting to save
4. **Report results** — print a summary: `Seeded X tools (Y new, Z updated), A workflows (B new, C updated), D solutions (E new, F updated)`
5. **Validate taxonomy** — every `category` and `verified_use_case` slug must be in the canonical lists defined above. Reject entries that violate this.

```typescript
// src/scripts/seed.ts — REWRITE TO THIS PATTERN

import mongoose from "mongoose";
import config from "../config/app.config";
import Tool from "../modules/tool/models/tool.model";
import Workflow from "../modules/workflow/models/workflow.model";
import Solution from "../modules/solution/models/solution.model";

// Import the data files
import toolsData from "./data/tools.json";
import workflowsData from "./data/workflows.json";
import solutionsData from "./data/solutions.json";

// Canonical taxonomy for validation
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
  "video_editing",
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
];

interface SeedResult {
  new: number;
  updated: number;
  skipped: number;
  errors: string[];
}

async function validateTool(tool: any): Promise<string[]> {
  const errors: string[] = [];
  if (!tool.name) errors.push("Missing name");
  if (!tool.description) errors.push("Missing description");
  if (!tool.url) errors.push("Missing url");
  if (!tool.pricing) errors.push("Missing pricing");
  if (!tool.platform) errors.push("Missing platform");
  if (!tool.category) errors.push("Missing category");
  else if (!VALID_CATEGORIES.includes(tool.category)) {
    errors.push(`Invalid category: "${tool.category}"`);
  }
  if (
    !Array.isArray(tool.verified_use_cases) ||
    tool.verified_use_cases.length < 2
  ) {
    errors.push("verified_use_cases must have at least 2 items");
  } else {
    const invalidSlugs = tool.verified_use_cases.filter(
      (s: string) => !VALID_USE_CASE_SLUGS.includes(s),
    );
    if (invalidSlugs.length > 0) {
      errors.push(`Invalid use_case slugs: ${invalidSlugs.join(", ")}`);
    }
  }
  if (!Array.isArray(tool.tags) || tool.tags.length < 1) {
    errors.push("tags must have at least 1 item");
  } else {
    const invalidTags = tool.tags.filter(
      (t: string) => !VALID_TAGS.includes(t),
    );
    if (invalidTags.length > 0) {
      errors.push(`Invalid tags: ${invalidTags.join(", ")}`);
    }
  }
  return errors;
}

async function seedTools(): Promise<SeedResult> {
  const result: SeedResult = { new: 0, updated: 0, skipped: 0, errors: [] };

  for (const tool of toolsData) {
    const validationErrors = await validateTool(tool);
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

  for (const workflow of workflowsData) {
    if (!workflow.title) {
      result.skipped++;
      result.errors.push("[WORKFLOW:UNNAMED] Missing title");
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

  for (const solution of solutionsData) {
    // This is the field that caused the original seed bug — always validate explicitly
    if (!solution.issue_title) {
      result.skipped++;
      result.errors.push(
        `[SOLUTION:UNNAMED] CRITICAL: Missing required field 'issue_title'. This was the original seed error. Every solution MUST have issue_title.`,
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
```

---

## SECTION 7 — TOOL RETRIEVAL UPGRADE

### 7.1 Fix the `getToolsForUser` Method

The current `getToolsForUser` in `src/modules/tool/tool.service.ts` needs these improvements:

1. **Expand role-to-use-case mapping** to cover all new tools and slugs
2. **Return at least 10 tools per user** (the PRD says minimum 5 per search, but catalog should be richer)
3. **Handle the case where a user has no `professionalProfile`** — return a curated "getting started" selection instead of an empty result
4. **Add a `featured` fallback** — if fewer than 10 tools match, pad with high-relevance general tools

```typescript
// Full updated role mapping for getToolsForUser

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
```

---

## SECTION 8 — EDGE CASES YOU MUST HANDLE

These are all the edge cases the data layer must survive:

### 8.1 Search Edge Cases

- [ ] User search returns fewer than 5 tool matches → system must still return something useful with a note that results are limited
- [ ] User search topic has no matching `verified_use_cases` → fall back to `category` matching, then `tags` matching, then fuzzy name search
- [ ] User asks about a tool that exists in the DB with a slightly different name (e.g. "Grammarly" vs "GrammarlyGO") → name search must be case-insensitive and partial

### 8.2 Profile Edge Cases

- [ ] User has `onboardingCompleted: false` and hits `/tools/for-me` → return the featured fallback list with a message prompting them to complete onboarding
- [ ] User profile has a `core_role` value not in the role mapping → treat as `"other"` and return general tools
- [ ] User profile has empty `primary_tools` array → don't crash, treat as if no tools listed

### 8.3 AI Recommendation Edge Cases

- [ ] AI tries to recommend a tool name not in the DB → the system must strip it from results (this is already partially implemented — make it bulletproof)
- [ ] All 5 minimum tools have the same category → still return them (don't artificially diversify; let the user query drive results)
- [ ] DB has fewer than 5 tools matching the query criteria → return all matching tools + explain the limitation in the clarification message

### 8.4 Seed Edge Cases

- [ ] Running `npm run seedData` twice → no duplicates, updates in-place (idempotent ✅ covered in Section 6)
- [ ] A tool in `tools.json` has an invalid category string → skip it, log the error, continue (covered ✅)
- [ ] A solution is missing `issue_title` → skip with explicit error (covered ✅ — this was the original bug)
- [ ] `recommended_tools` in workflows/solutions reference a tool name not in `tools.json` → log a warning but do not fail the seed

### 8.5 Data Integrity

- [ ] Tool `url` field should always start with `https://` — add validation
- [ ] Tool `name` must be unique — the model already enforces this, seed upsert handles it
- [ ] No tool should have an empty `verified_use_cases` array — minimum 2 required

---

## SECTION 9 — FILES TO CREATE / MODIFY

### Files to CREATE:

```
src/scripts/data/tools.json          ← REPLACE entirely with 150 tools from Section 3
src/scripts/data/workflows.json      ← ADD 15 new entries from Section 4 (keep existing 5)
src/scripts/data/solutions.json      ← ADD 11 new entries from Section 5 (keep existing 4)
```

### Files to MODIFY:

```
src/scripts/seed.ts                  ← REWRITE with idempotent pattern from Section 6
src/modules/tool/tool.service.ts     ← UPDATE getToolsForUser with new mappings from Section 7
```

### Files to VERIFY (should not need changes but double-check):

```
src/modules/tool/models/tool.model.ts      ← Ensure category and tags fields exist as [String]
src/modules/solution/models/solution.model.ts  ← Ensure issue_title is marked required: true
src/modules/workflow/models/workflow.model.ts  ← Ensure title is marked required: true
```

---

## SECTION 10 — VALIDATION CHECKLIST (Run After Seeding)

After running `npm run seedData`, verify in MongoDB Atlas:

```
Tools collection:    count >= 150
Workflows collection: count >= 20
Solutions collection: count >= 15

Each tool has:
  - name (string, unique, not empty)
  - description (string, > 50 chars)
  - url (string, starts with https://)
  - pricing (one of: Free, Freemium, Paid, Free trial)
  - platform (string, not empty)
  - verified_use_cases (array, length >= 2)
  - category (one of the 16 valid categories)
  - tags (array, length >= 1)

Each solution has:
  - issue_title (string, REQUIRED — this was the bug)

Each workflow has:
  - title (string, REQUIRED)
  - steps (array, length >= 5)
```

### API Test Queries to Run After Seeding:

```bash
# Should return 5+ tools ranked by relevance
POST /api/v1/chats
{ "prompt": "I need tools for designing logos as a graphic designer" }

# Should return personalized catalog grouped by category
GET /api/v1/tools/for-me
Authorization: Bearer <token_of_user_with_graphic_designer_profile>

# Should return 15+ design tools
GET /api/v1/tools?search=design&limit=20

# Should return the CORS solution
GET /api/v1/solutions?search=CORS
```

---

## FINAL NOTES FOR THE AGENT

1. **Do not rebuild the existing backend** — it is well-architected. Your job is data, not architecture.
2. **The original seed error was `issue_title` missing** — make sure every solution in the new data has this field.
3. **The zero-hallucination constraint is sacred** — the AI can only recommend tools that exist in the DB. The existing chat controller already sends DB tools as context. Make sure the DB is rich enough that this constraint never returns fewer than 5 results for common queries.
4. **Use the exact canonical taxonomy** from Section 2. Do not invent new category names or use_case slugs — they will break the `getToolsForUser` mapping.
5. **Test the seed twice** — run `npm run seedData` twice in a row. The second run should report 0 new, 150 updated, 0 errors.
6. **All tool URLs are real** — do not invent URLs. Every URL in Section 3 is the real homepage of a real AI tool.
