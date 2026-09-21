import type { Request, Response } from 'express';
import { UserService } from '../service/users.service.ts';	
import { wrap } from '../lib/helpers.ts';

// const getPresignedUrl = (type:"avatars" | "banners") => {
//     return wrap(async (req:Request, res:Response) => {
//         if(!req.user) throw new Error('something'); //TODO
//         const { contentType } = req.body;
//         if(!contentType) return res.status(400).json({error: 'content type is missing!'})
//         const result = type === 'avatars' 
//             ? await UserService.getAvatarPresignedUrl(req.user.id, contentType) 
//             : await UserService.getBannerPresignedUrl(req.user.id, contentType);
//         return res.status(200).json(result);
//     });
// };

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const getPresignedUrl = (type: 'avatars' | 'banners') =>
    wrap(async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'unauthorized' });

        const { contentType } = req.body;
        if (typeof contentType !== 'string' || !ALLOWED_TYPES.includes(contentType)) {
            return res.status(400).json({ error: 'invalid content type' });
        }

        const result = type === 'avatars'
            ? await UserService.getAvatarPresignedUrl(req.user.id, contentType)
            : await UserService.getBannerPresignedUrl(req.user.id, contentType);

        return res.json(result);
});

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
	getPresignedUrl,
	updateProfile,
};