import { Router } from "express";
import { BookmarkController } from "./bookmark.controller";
import { protect } from "../../middlewares/auth.middleware";

const controller = new BookmarkController();
const router = Router();

// Secure all bookmark endpoints
router.use(protect);

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: Save a recommended tool to user's bookmarks
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tool_name, tool_description, tool_url]
 *             properties:
 *               tool_name:
 *                 type: string
 *               tool_description:
 *                 type: string
 *               tool_url:
 *                 type: string
 *               tool_id:
 *                 type: string
 *                 description: Optional reference exactly to catalog ID
 *     responses:
 *       201:
 *         description: Tool bookmarked successfully
 */
router.post("/", controller.saveBookmark);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Get all saved tools/bookmarks for the authenticated user
 *     tags: [Bookmarks]
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
 *     responses:
 *       200:
 *         description: Saved tools retrieved successfully
 */
router.get("/", controller.getBookmarks);

/**
 * @swagger
 * /bookmarks/{id}:
 *   delete:
 *     summary: Remove a saved tool from bookmarks
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tool removed logically
 */
router.delete("/:id", controller.deleteBookmark);

export default router;
