import { Router } from "express";
import { SolutionController } from "./solution.controller";
import { protect } from "../../middlewares/auth.middleware";

const controller = new SolutionController();
const router = Router();

router.use(protect);

/**
 * @swagger
 * /solutions:
 *   get:
 *     summary: Retrieve a list of all solutions
 *     tags: [Solutions]
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
 *         description: A list of solutions
 */
router.get("/", controller.getSolutions);

/**
 * @swagger
 * /solutions/{id}:
 *   get:
 *     summary: Get a specific solution by ID
 *     tags: [Solutions]
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
 *         description: Solution details
 */
router.get("/:id", controller.getSolution);

export default router;
