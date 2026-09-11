import { Router } from "express";
import {UsersControllers} from '../controllers/users.controller.ts';
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { errorMiddleware } from "../middlewares/error.middleware.ts";

const router = Router();

router.put(
	'/user/:userId/picture', 
	errorMiddleware, authMiddleware, 
	UsersControllers.uploadProfilePicture
);
router.put(
	'/user/:userId/profile', 
	errorMiddleware, authMiddleware, 
	UsersControllers.updateProfile
);

export default router;