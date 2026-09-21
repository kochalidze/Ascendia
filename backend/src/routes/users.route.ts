import { Router } from "express";
import {UsersControllers} from '../controllers/users.controller.ts';
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { errorMiddleware } from "../middlewares/error.middleware.ts";

const router = Router();

router.put(
	'/me/profile', 
	errorMiddleware, authMiddleware, 
	UsersControllers.updateProfile
);
router.post(
	'/me/avatar/presign',
	errorMiddleware, authMiddleware, 
	UsersControllers.getPresignedUrl('avatars')
);
router.post(
	'/me/banner/presign',
	errorMiddleware, authMiddleware, 
	UsersControllers.getPresignedUrl('banners')
);

export default router;