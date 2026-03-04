import { body } from "express-validator";
import { NormalizationSchemas } from "./normalization.schemas";

export const normalizeValidator = [
  body("input").notEmpty().withMessage("Input text is required"),
  body("schemaType")
    .notEmpty()
    .withMessage("Schema type is required")
    .isIn(Object.keys(NormalizationSchemas))
    .withMessage("Invalid schema type"),
  body("provider")
    .optional()
    .isString()
    .withMessage("Provider must be a string"),
];

export const professionValidator = [
  body("input").notEmpty().withMessage("Professional description is required"),
  body("provider")
    .optional()
    .isString()
    .withMessage("Provider must be a string"),
];
