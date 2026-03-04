export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum ExperienceLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export enum Industry {
  SOFTWARE_DEVELOPMENT = "software_development",
  DESIGN = "design",
  MARKETING = "marketing",
  CONTENT_CREATION = "content_creation",
  OTHER = "other",
}

export enum CoreRole {
  SOFTWARE_ENGINEER = "software_engineer",
  GRAPHIC_DESIGNER = "graphic_designer",
  CONTENT_WRITER = "content_writer",
  PRODUCT_MANAGER = "product_manager",
  MARKETER = "marketer",
  OTHER = "other",
}

export interface IUserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  passwordChangedAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  professionalProfile?: {
    industry: Industry;
    core_role: CoreRole;
    experience_level: ExperienceLevel;
    key_skills: string[];
    primary_tools: string[];
    daily_responsibilities: string[];
    current_objectives: string[];
    main_pain_points: string[];
    detailed_context: string;
  };
}
