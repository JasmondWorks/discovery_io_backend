import express from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import normalizationRoutes from "../modules/normalization/normalization.route";
import mediaRoutes from "../modules/media/media.route";
import chatRoutes from "../modules/chat/chat.route";
import bookmarkRoutes from "../modules/bookmark/bookmark.route";

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

export default router;
