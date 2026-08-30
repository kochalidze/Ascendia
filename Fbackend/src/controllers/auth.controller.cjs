const db = require('../config/db.cjs');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const getJWTSecret = () => process.env.JWT_SECRET;

const getMe = async (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, username, email, bio, role, coins, level, xp, avatar, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'სერვერის შეცდომა მონაცემების წამოღებისას' });
  }
};

const register = (req, res) => {
	const { username, email, password, bio, avatar } = req.body;
	
	try {
		if (!username || !email || !password) {
			return res.status(400).json({ message: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი" });
		}

		let role = 'user';
		if (email === adminEmail && password === adminPassword) {
			role = 'admin';
		}

		const hashedPassword = bcrypt.hashSync(password, 10);

		const stmt = db.prepare(`
			INSERT INTO users (username, email, password, bio, avatar, role) 
			VALUES (?, ?, ?, ?, ?, ?)
		`);
		const info = stmt.run(username, email, hashedPassword, bio || null, avatar || null, role);	
		
		const createdUser = db
            .prepare('SELECT id, username, email, bio, role, coins, level, xp, avatar, created_at FROM users WHERE id = ?')
            .get(info.lastInsertRowid);
            
        res.status(201).json({ user: createdUser });
	}catch (error) {
		res.status(500).json({ message: "სერვერის შეცდომა", error: error.message });
	}

}

const login = (req, res) => {
	const { email, password } = req.body;
	console.log('მოვიდა request:', { email, password });

	try {
		const jwtSecret = getJWTSecret();

		if (!email || !password) {
			return res.status(400).json({ message: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი" });
		}

		const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
		if (!user) {
			return res.status(400).json({ message: "მომხმარებელი ვერ მოიძებნა" });
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "პაროლი არასწორია" });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			getJWTSecret(),
			{ expiresIn: '3w' }
		);

		res.cookie('token', token, { 
			httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3 * 7 * 24 * 60 * 60 * 1000 // 3 კვირა
		});

		res.status(200).json({ 
			message: "წარმატებით შეხვდით",
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
				bio: user.bio,
				coins: user.coins,
				level: user.level,
				xp: user.xp,
				avatar: user.avatar,
				created_at: user.created_at
			}
		});
	}catch (error) {
		res.status(500).json({ message: "სერვერის შეცდომა", error: error.message });
	}
}

module.exports = { 
	getMe,
	register,
	login
};