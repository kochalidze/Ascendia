const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');
const db = new Database(dbPath);

// * ____________________Start Create users table____________________
const createUsersTable = `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		
		username TEXT NOT NULL UNIQUE,
		bio TEXT,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		role TEXT DEFAULT 'user',

		coins INTEGER DEFAULT 0,
		level INTEGER DEFAULT 0,
		xp INTEGER DEFAULT 0,
		avatar TEXT,
		
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_users_level_xp 
	ON users(level DESC, xp DESC);
`;
db.exec(createUsersTable);
// * ____________________End create users table____________________


// * ____________________Start Create Posts table____________________________________
const createPostsTable = `
	CREATE TABLE IF NOT EXISTS posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,

		title TEXT NOT NULL,
		content TEXT NOT NULL,
		xp_rewarded INTEGER DEFAULT 0,
		author_id INTEGER NOT NULL,

		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

		FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
	);
`;
db.exec(createPostsTable);

// ? _____Create Posts index_____
const createPostsIndex = `
	CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);`;
db.exec(createPostsIndex);
// ? _____End create Posts index_____



// ? _____Start Alter Posts table to add type column_____
//! type TEXT NOT NULL, -- broadcast, intel, challenge
const alterPostsType = `
	ALTER TABLE posts ADD COLUMN type TEXT NOT NULL DEFAULT 'broadcast';
`;
try {
    db.exec(alterPostsType);
} catch (err) {
    if (!err.message.includes('duplicate column name')) {
        console.error('Migration error:', err);
    }
}
// ? _____End Alter Posts table to add type column_____

// ? _____Start Alter Posts table to add coins_rewarded column_____
// const alterPostCoins = `
// 	ALTER TABLE posts ADD COLUMN coins_rewarded INTEGER DEFAULT 0;
// `;
// try {
//     db.exec(alterPostCoins);
// } catch (err) {
//     if (!err.message.includes('duplicate column name')) {
//         console.error('Migration error:', err);
//     }
// }
// ? _____End Alter Posts table to add coins_rewarded column_____
// * ____________________End create Posts table____________________________________



// * ____________________Start Create Posts Likes table____________________________________

const createPostsLikesTable = `
	CREATE TABLE IF NOT EXISTS post_likes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	post_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(post_id, user_id)
	);

	CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
`;
db.exec(createPostsLikesTable);

// * ____________________End create Posts Likes table____________________________________


// * ____________________Start Create Missions table____________________________________

const createMissionsTable = `
	CREATE TABLE  IF NOT EXISTS missions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		xp_reward INTEGER NOT NULL DEFAULT 0,
		coins_reward INTEGER NOT NULL DEFAULT 0,
		status TEXT NOT NULL DEFAULT 'active',   -- active | inactive
		created_by INTEGER NOT NULL REFERENCES users(id),
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);

	CREATE TABLE IF NOT EXISTS user_missions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL REFERENCES users(id),
		mission_id INTEGER NOT NULL REFERENCES missions(id),
		completed_at TEXT NOT NULL DEFAULT (datetime('now')),
		UNIQUE(user_id, mission_id)   
	);

	CREATE INDEX IF NOT EXISTS idx_user_missions_user ON user_missions(user_id);
	CREATE INDEX IF NOT EXISTS idx_user_missions_mission ON user_missions(mission_id);
`;
db.exec(createMissionsTable);

// * ____________________End create Missions table____________________________________


module.exports = db;