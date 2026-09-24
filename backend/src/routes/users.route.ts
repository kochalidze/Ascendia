import { Router } from "express";
import { UsersControllers } from '../controllers/users.controller.ts';
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(authMiddleware);

// router.put('/me/profile', UsersControllers.updateProfile);

router.post('/me/avatar/presign', UsersControllers.getPresignedUrl('avatars'));
router.post('/me/posts/media/presign', UsersControllers.getPresignedUrl('posts'));

router.get('/me/posts', UsersControllers.getUserPosts);
router.post('/me/posts', UsersControllers.createPost);

export default router;