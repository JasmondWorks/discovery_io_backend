import { Router } from "express";
import { WorkflowController } from "./workflow.controller";
import { protect } from "../../middlewares/auth.middleware";

const controller = new WorkflowController();
const router = Router();

router.use(protect);

/**
 * @swagger
 * /workflows:
 *   get:
 *     summary: Retrieve a list of all workflows
 *     tags: [Workflows]
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
 *         description: A list of workflows
 */
router.get("/", controller.getWorkflows);

/**
 * @swagger
 * /workflows/{id}:
 *   get:
 *     summary: Get a specific workflow by ID
 *     tags: [Workflows]
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
 *         description: Workflow details
 */
router.get("/:id", controller.getWorkflow);

export default router;
