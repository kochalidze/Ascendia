const db = require('../config/db.cjs');

const { awardXp } = require('../service/xpService.cjs');

const createPost = (req, res) => {
	const { title, content, type } = req.body;
	const author_id = req.user.id;

	// XP ტიპის მიხედვით 
	const XP_MAP = {
		challange: 20,
		intel: 15,
		broadcast: 10
	};

	const xp_rewarded = XP_MAP[type] ?? 10; 

	try {
		const tx = db.transaction(() => {
			const info = db.prepare('INSERT INTO posts (title, content, type, xp_rewarded, author_id) VALUES (?, ?, ?, ?, ?)').run(title, content, type, xp_rewarded, author_id);
			awardXp(db, author_id, xp_rewarded);
			return info.lastInsertRowid;
		});

		const newId = tx();

		res.status(201).json({
			id: newId,
			title,
			content,
			type,
			xp_rewarded,
			author_id,
			created_at: new Date().toISOString()
		});
	} catch (error) {
		console.error('Error creating post:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const getAllPosts = (req, res) => {
	const userId = req.user?.id ?? null;

	try {
		const stmt = db.prepare(`
			SELECT 
				posts.id,
				posts.title,
				posts.content,
				posts.type,
				posts.xp_rewarded,
				posts.author_id,
				posts.created_at,
				users.username,
				(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id) AS like_count,
				EXISTS(
					SELECT 1 FROM post_likes 
					WHERE post_likes.post_id = posts.id AND post_likes.user_id = ?
				) AS liked_by_me
			FROM posts
			JOIN users ON posts.author_id = users.id
			ORDER BY posts.created_at DESC
		`);
		const posts = stmt.all(userId).map(post => ({
			...post,
			liked_by_me: Boolean(post.liked_by_me)
		}));
		res.json(posts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const getPostsByAuthor = (req, res) => {
	const { author_id } = req.params;
	try {
		const stmt = db.prepare('SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC');
		const posts = stmt.all(author_id);
		res.json(posts);
	} catch (error) {
		console.error('Error fetching posts by author:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const getPostById = (req, res) => {
	const { id } = req.params;
	const userId = req.user?.id ?? null;

	try {
		const stmt = db.prepare(`
			SELECT 
				posts.*,
				users.username,
				(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id) AS like_count,
				EXISTS(
					SELECT 1 FROM post_likes 
					WHERE post_likes.post_id = posts.id AND post_likes.user_id = ?
				) AS liked_by_me
			FROM posts
			JOIN users ON posts.author_id = users.id
			WHERE posts.id = ?
		`);
		const post = stmt.get(userId, id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		post.liked_by_me = Boolean(post.liked_by_me);
		res.json(post);
	} catch (error) {
		console.error('Error fetching post:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const updatePost = (req, res) => {
	const { id } = req.params;
	const { title, content, xp_rewarded } = req.body;
	const author_id = req.user.id;

	try {
		const stmt = db.prepare('UPDATE posts SET title = ?, content = ?, xp_rewarded = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND author_id = ?');
		const info = stmt.run(title, content, xp_rewarded, id, author_id);
		if (info.changes === 0) {
			return res.status(404).json({ message: 'Post not found or unauthorized' });
		}
		const updatedPost = {
			id: parseInt(id),
			title,
			content,
			xp_rewarded,
			updated_at: new Date().toISOString()
		};
		res.json(updatedPost);
	} catch (error) {
		console.error('Error updating post:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const deletePost = (req, res) => {
	const { id } = req.params;
	const author_id = req.user.id;

	try {
		const stmt = db.prepare('DELETE FROM posts WHERE id = ? AND author_id = ?');
		const info = stmt.run(id, author_id);
		if (info.changes === 0) {
			return res.status(404).json({ message: 'Post not found or unauthorized' });
		}
		res.json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.error('Error deleting post:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const likePost = (req, res) => {
	  const postId = Number(req.params.id);
	const userId = req.user.id; 

	if (!Number.isInteger(postId)) {
		return res.status(400).json({ error: 'Invalid post id' });
	}

	try {
		const toggle = db.transaction(() => {
		const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
		if (!post) {
			throw new Error('POST_NOT_FOUND');
		}

		const existing = db
			.prepare('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?')
			.get(postId, userId);

		let liked;
		if (existing) {
			db.prepare('DELETE FROM post_likes WHERE id = ?').run(existing.id);
			liked = false;
		} else {
			db.prepare(
			'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)'
			).run(postId, userId);
			liked = true;
		}

		const { count } = db
			.prepare('SELECT COUNT(*) AS count FROM post_likes WHERE post_id = ?')
			.get(postId);

		return { liked, count };
		});

		const result = toggle();
		return res.json(result);
	} catch (err) {
		if (err.message === 'POST_NOT_FOUND') {
		return res.status(404).json({ error: 'Post not found' });
		}
		console.error('toggleLike error:', err);
		return res.status(500).json({ error: 'Failed to toggle like' });
	}
}


module.exports = {
	createPost,
	getAllPosts,
	getPostById,
	getPostsByAuthor,
	updatePost,
	deletePost,
	likePost
};