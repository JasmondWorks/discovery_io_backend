import express from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import normalizationRoutes from "../modules/normalization/normalization.route";
import mediaRoutes from "../modules/media/media.route";
import chatRoutes from "../modules/chat/chat.route";
import bookmarkRoutes from "../modules/bookmark/bookmark.route";
import toolRoutes from "../modules/tool/tool.route";
import workflowRoutes from "../modules/workflow/workflow.route";
import solutionRoutes from "../modules/solution/solution.route";

const router = express.Router();

// Health check
router.get("/health", (_, res) => {
  res.status(200).json({ ok: true });
});

// Mount modules
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/normalize", normalizationRoutes);
router.use("/media", mediaRoutes);
router.use("/chats", chatRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/tools", toolRoutes);
router.use("/workflows", workflowRoutes);
router.use("/solutions", solutionRoutes);

export default router;
