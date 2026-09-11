import type { Request, Response } from 'express';
import { UserService } from '../service/users.service.ts';	

const uploadProfilePicture = async (req: Request, res: Response) => {
	try {
		if(!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const r2Key = await UserService.saveProfilePicture(
			userId,
			req.file.buffer,    
			req.file.mimetype  
		);

		return res.status(200).json({
			message: "profile picture uploaded successfully",
			avatarKey: r2Key,
		});
	}catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to upload profile picture' });
	}
};

const updateProfile = async (req: Request, res: Response) => {
	try {

		const userId = req.user?.id;
		const userData = req.body;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		await UserService.updateProfile(userId, userData);

		return res.status(200).json({ message: 'Profile updated successfully' });
	}catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update profile' });
	}
}

export const UsersControllers = {
	uploadProfilePicture,
	updateProfile,
};