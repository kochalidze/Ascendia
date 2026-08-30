const db = require('../config/db.cjs');

const getAllUsers = async (req, res) => {
	try {
		const stmt = db.prepare('SELECT * FROM users');
		const users = stmt.all();
		res.json(users);
	}catch (error) {
		res.status(500).json({ error: 'Failed to fetch users' });
		console.log('Fetch users error:', error);
	}
}

const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const stmt = db.prepare('SELECT id, username, email, bio, role, coins, level, xp, avatar, created_at FROM users WHERE id = ?');
		const user = stmt.get(id);
		if (!user) {
			return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
		}
		res.json(user);
	}	catch (error) {
		res.status(500).json({ error: 'Failed to fetch user' });
		console.log('Fetch user error:', error);
	}
}

const getTopUsers = async (req, res) => {
	try {
		const stmt = db.prepare(`
			SELECT id, username, email, bio, role, coins, level, xp, avatar 
			FROM users 
			ORDER BY level DESC, xp DESC LIMIT 10`);
		const users = stmt.all();
		res.json(users);
	}	catch (error) {
		res.status(500).json({ error: 'Failed to fetch top users' });
		console.log('Fetch top users error:', error);
	}
}

const updateUserProfile = async (req, res) => {
	const { id } = req.params;
	const { username, bio, avatar } = req.body;
	try {		
		const stmt = db.prepare('UPDATE users SET username = ?, bio = ?, avatar = ? WHERE id = ?');
		const result = stmt.run(username, bio, avatar, id);
		if (result.changes === 0) {
			return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
		}
		res.json({ message: 'პროფილი წარმატებით განახლდა' });
	}	catch (error) {
		res.status(500).json({ error: 'Failed to update profile' });
		console.log('Update profile error:', error);
	}
}

const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const stmt = db.prepare('DELETE FROM users WHERE id = ?');
		const result = stmt.run(id);
		if (result.changes === 0) {
			return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
		}
		res.json({ message: 'მომხმარებელი წარმატებით წაიშალა' });
	}	catch (error) {
		res.status(500).json({ error: 'Failed to delete user' });
		console.log('Delete user error:', error);
	}
}

module.exports = {
	getAllUsers,
	getUserById,
	getTopUsers,
	updateUserProfile,
	deleteUser
}