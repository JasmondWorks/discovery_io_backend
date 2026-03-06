import { Router } from "express";
import { ChatController } from "./chat.controller";
import { protect } from "../../middlewares/auth.middleware";

const controller = new ChatController();
const router = Router();

// Secure all chat routes for authenticated users only
router.use(protect);

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat session
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat session created
 */
router.post("/", controller.createChatSession);

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Get user's chat sessions (history)
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     description: Fetch a paginated list of all chat sessions created by the authenticated user.
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
 *         description: Sessions retrieved
 */
router.get("/", controller.getChatSessions);

/**
 * @swagger
 * /chats/{id}/messages:
 *   get:
 *     summary: Get all messages from a specific chat session
 *     tags: [Chats]
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
 *         description: Messages retrieved chronologically
 */
router.get("/:id/messages", controller.getSessionMessages);

/**
 * @swagger
 * /chats/{id}/messages:
 *   post:
 *     summary: Add a new message to an existing chat and get AI response
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 description: The user's follow-up prompt
 *     responses:
 *       201:
 *         description: User and Assistant messages appended successfully
 */
router.post("/:id/messages", controller.addMessageToSession);

export default router;
