import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { MediaController } from "./media.controller";
import { protect } from "../../middlewares/auth.middleware";
import appConfig from "../../config/app.config";

const router = express.Router();
const controller = new MediaController();

// Configure Cloudinary
cloudinary.config({
  cloud_name: appConfig.cloudinary.cloudName,
  api_key: appConfig.cloudinary.apiKey,
  api_secret: appConfig.cloudinary.apiSecret,
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "discover_io",
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "pdf"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload a media file to Cloudinary
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *       400:
 *         description: Invalid input or no file
 *       401:
 *         description: Unauthorized
 */
router.post("/upload", protect, upload.single("file"), controller.upload);

export default router;
