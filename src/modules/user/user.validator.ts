import { body } from "express-validator";
import { Industry, CoreRole, ExperienceLevel } from "./user.entity";

export const createUserValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const updateUserValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("role")
    .optional()
    .isIn(["USER", "ADMIN", "SUPER_ADMIN"])
    .withMessage("Invalid role"),
];

export const updateProfessionalProfileValidator = [
  body("professionalProfile")
    .isObject()
    .withMessage("professionalProfile must be an object"),

  body("professionalProfile.industry")
    .optional()
    .isIn(Object.values(Industry))
    .withMessage(
      `Invalid industry. Must be one of: ${Object.values(Industry).join(", ")}`,
    ),

  body("professionalProfile.core_role")
    .optional()
    .isIn(Object.values(CoreRole))
    .withMessage(
      `Invalid core role. Must be one of: ${Object.values(CoreRole).join(", ")}`,
    ),

  body("professionalProfile.experience_level")
    .optional()
    .isIn(Object.values(ExperienceLevel))
    .withMessage(
      `Invalid experience level. Must be one of: ${Object.values(ExperienceLevel).join(", ")}`,
    ),

  body("professionalProfile.key_skills")
    .optional()
    .isArray()
    .withMessage("key skills must be an array of strings"),

  body("professionalProfile.primary_tools")
    .optional()
    .isArray()
    .withMessage("primary tools must be an array of strings"),

  body("professionalProfile.daily_responsibilities")
    .optional()
    .isArray()
    .withMessage("daily responsibilities must be an array of strings"),

  body("professionalProfile.current_objectives")
    .optional()
    .isArray()
    .withMessage("current objectives must be an array of strings"),

  body("professionalProfile.main_pain_points")
    .optional()
    .isArray()
    .withMessage("main pain points must be an array of strings"),

  body("professionalProfile.detailed_context")
    .optional()
    .isString()
    .withMessage("detailed context must be a string"),

  body("onboardingCompleted")
    .optional()
    .isBoolean()
    .withMessage("onboardingCompleted must be a boolean"),
];
