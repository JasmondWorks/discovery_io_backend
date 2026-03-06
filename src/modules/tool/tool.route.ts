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
 *     summary: Retrieve a list of all tools
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
 *         description: A list of tools
 */
router.get("/", controller.getTools);

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
