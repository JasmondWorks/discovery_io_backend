import { Router } from "express";
import { UserController } from "../../modules/user/user.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { UserRole } from "../../modules/user/user.entity";
import {
  createUserValidator,
  updateUserValidator,
  updateProfessionalProfileValidator,
} from "../../modules/user/user.validator";
import { validateRequest } from "../../middlewares/validate-request.middleware";

const controller = new UserController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

router.use(protect);

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user profile retrieved
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 */
/**
 * @swagger
 * /user/me/professional-profile:
 *   patch:
 *     summary: Update current user's professional profile onboarding information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               professionalProfile:
 *                 type: object
 *                 properties:
 *                   industry: { type: string, enum: [software_development, design, marketing, content_creation, other] }
 *                   core_role: { type: string, enum: [software_engineer, graphic_designer, content_writer, product_manager, marketer, other] }
 *                   experience_level: { type: string, enum: [beginner, intermediate, advanced, expert] }
 *                   primary_tools: { type: array, items: { type: string } }
 *                   main_pain_points: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Professional Profile updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 */
router.patch(
  "/me/professional-profile",
  updateProfessionalProfileValidator,
  validateRequest,
  controller.updateProfessionalProfile,
);

router.get("/me", controller.getMe);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.getAllUsers,
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User retrieved
 */
router.get(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.getUserById,
);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user (Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [user, admin, super-admin] }
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post(
  "/",
  restrictTo(UserRole.SUPER_ADMIN),
  createUserValidator,
  validateRequest,
  controller.createUser,
);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user (Super Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch(
  "/:id",
  restrictTo(UserRole.SUPER_ADMIN),
  updateUserValidator,
  validateRequest,
  controller.updateUser,
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user (Super Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete("/:id", restrictTo(UserRole.SUPER_ADMIN), controller.deleteUser);

export default router;
