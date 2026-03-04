export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
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
    industry: string;
    core_role: string;
    experience_level: string;
    key_skills: string[];
    primary_tools: string[];
    daily_responsibilities: string[];
    current_objectives: string[];
    main_pain_points: string[];
    detailed_context: string;
  };
}
