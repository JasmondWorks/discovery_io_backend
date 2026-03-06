import { Router } from "express";
import { NormalizationController } from "./normalization.controller";
import {
  normalizeValidator,
  professionValidator,
} from "./normalization.validator";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { protect } from "../../middlewares/auth.middleware";

const controller = new NormalizationController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Normalization
 *   description: AI-powered data normalization
 */

/**
 * @swagger
 * /normalize:
 *   post:
 *     summary: Normalize open-ended input into a backend-defined structure
 *     tags: [Normalization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [input, schemaType]
 *             properties:
 *               input:
 *                 type: string
 *                 description: The open-ended text to normalize
 *               schemaType:
 *                 type: string
 *                 enum: [product, event, contact, professional_profile]
 *                 description: The target structure to match
 *               provider:
 *                 type: string
 *                 description: Optional AI provider (e.g., openai)
 *     responses:
 *       200:
 *         description: Input normalized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: object }
 *                 message: { type: string }
 *       400:
 *         description: Invalid input or schema type
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  protect,
  normalizeValidator,
  validateRequest,
  controller.normalize,
);

/**
 * @swagger
 * /normalize/profession:
 *   post:
 *     summary: Specialized endpoint for occupational context normalization
 *     description: Automatically uses the 'professional_profile' schema to capture full context of a user's work.
 *     tags: [Normalization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [input]
 *             properties:
 *               input:
 *                 type: string
 *                 description: Open-ended description of the user's line of work
 *               provider:
 *                 type: string
 *                 description: Optional AI provider
 *     responses:
 *       200:
 *         description: Professional profile normalized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     industry: { type: string }
 *                     core_role: { type: string }
 *                     experience_level: { type: string }
 *                     key_skills: { type: array, items: { type: string } }
 *                     primary_tools: { type: array, items: { type: string } }
 *                     daily_responsibilities: { type: array, items: { type: string } }
 *                     current_objectives: { type: array, items: { type: string } }
 *                     main_pain_points: { type: array, items: { type: string } }
 *                     detailed_context: { type: string }
 *                 message: { type: string }
 *       401:
 *         description: Unauthorized
 * */
router.post(
  "/profession",
  protect,
  professionValidator,
  validateRequest,
  controller.normalizeProfession,
);

export default router;
