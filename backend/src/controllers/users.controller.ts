import type { Request, Response } from 'express';
import { UserService } from '../service/users.service.ts';	
import { wrap } from '../lib/helpers.ts';


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_POST_MEDIA = 10;
const CLIENT_ERRORS = ['Empty post', 'Too many files', 'Invalid media key'];

const getPresignedUrl = (type: 'avatars' | 'posts') =>
    wrap(async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ error: 'unauthorized' });

        const { contentType } = req.body;
        if (typeof contentType !== 'string' || !ALLOWED_TYPES.includes(contentType)) {
            return res.status(400).json({ error: 'invalid content type' });
        }

		const result = type === 'avatars'
			? await UserService.getAvatarPresignedUrl(req.user.id, contentType)
			: await UserService.getPostMediaPresignedUrl(req.user.id, contentType);

        return res.json(result);
});

// const updateProfile = async (req: Request, res: Response) => {
// 	try {

// 		const userId = req.user?.id;
// 		const userData = req.body;

// 		if (!userId) {
// 			return res.status(401).json({ error: 'Unauthorized' });
// 		}

// 		await UserService.updateProfile(userId, userData);

// 		return res.status(200).json({ message: 'Profile updated successfully' });
// 	}catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: 'Failed to update profile' });
// 	}
// }

const getUserPosts = wrap(async (req: Request, res: Response) => {
	if (!req.user) return res.status(401).json({ error: 'unauthorized' });
	
	try{
		const userId = req.user.id;
		const posts = await UserService.getUserPosts(userId);
		return res.json(posts);
	}catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch posts' });
	}
})

const createPost = wrap(async (req: Request, res: Response) => {
	if (!req.user) return res.status(401).json({ error: 'unauthorized' });

	const { caption, commentsDisabled, visibility, mediaKeys = [] } = req.body;

	if (
		typeof caption !== 'string' ||
		caption.length > 2200 ||
		typeof commentsDisabled !== 'boolean' ||
		!['public', 'private'].includes(visibility) ||
		!Array.isArray(mediaKeys) ||
		mediaKeys.length > MAX_POST_MEDIA ||
		!mediaKeys.every((k) => typeof k === 'string')
	) {
		return res.status(400).json({ error: 'Invalid input data' });
	}

	try {
		const newPost = await UserService.createPost(
			req.user.id,
			caption,
			commentsDisabled,
			visibility,
			mediaKeys
		);
		return res.status(201).json(newPost);
	} catch (error) {
		// service-ის "მოსალოდნელი" შეცდომები -> 400, დანარჩენი -> 500
		if (error instanceof Error && CLIENT_ERRORS.includes(error.message)) {
			return res.status(400).json({ error: error.message });
		}
		console.error(error);
		return res.status(500).json({ error: 'Failed to create post' });
	}
});

export const UsersControllers = {
	getPresignedUrl,
	// updateProfile,
	getUserPosts,
	createPost,
};