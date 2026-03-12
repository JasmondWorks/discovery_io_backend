import { Router } from "express";
import { ToolController } from "./tool.controller";
import { protect } from "../../middlewares/auth.middleware";

const controller = new ToolController();
const router = Router();

router.use(protect);

/**
 * @swagger
 * /tools:
 *   get:
 *     summary: Retrieve a list of all tools (general catalog)
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of all tools
 */
router.get("/", controller.getTools);

/**
 * @swagger
 * /tools/for-me:
 *   get:
 *     summary: Personalized tools catalog based on user's professional profile
 *     description: >
 *       PRD Feature 3 — Returns tools grouped by skill category, filtered to the
 *       authenticated user's core role and industry. After completing onboarding,
 *       users can browse this catalog as an alternative to the AI search flow.
 *       If the user has no professional profile yet, all tools are returned ungrouped.
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personalized tools catalog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 grouped:
 *                   type: boolean
 *                 role:
 *                   type: string
 *                 industry:
 *                   type: string
 *                 catalog:
 *                   type: object
 *                   description: Tools grouped by category key
 */
router.get("/for-me", controller.getToolsForUser);

/**
 * @swagger
 * /tools/{id}:
 *   get:
 *     summary: Get a specific tool by ID
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tool details
 */
router.get("/:id", controller.getTool);

export default router;
