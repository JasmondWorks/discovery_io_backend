export interface IToolEntity {
  id: string;
  name: string;
  description: string;
  url: string;
  pricing: string;
  platform: string;
  verified_use_cases: string[];
  /**
   * High-level grouping used by the Tools Catalog (PRD Feature 3).
   * e.g. "Design", "Writing", "Development", "Marketing", "Analysis", "Productivity"
   */
  category?: string;
  /**
   * Role / industry tags that make this tool visible in personalized catalog views.
   * e.g. ["graphic_designer", "content_writer"]
   */
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
