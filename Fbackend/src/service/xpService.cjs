// services/xpService.js

const XP_PER_LEVEL = 100;

// Pure ფუნქცია — მხოლოდ calculation, DB არაფერი
function applyXpGain(currentXp, currentLevel, xpGained) {
	let newXp = currentXp + xpGained;
	let newLevel = currentLevel;

	while (newXp >= XP_PER_LEVEL) {
		newXp -= XP_PER_LEVEL;
		newLevel += 1;
	}

	return {
		newXp,
		newLevel,
		leveledUp: newLevel > currentLevel
	};
}

// DB-სთან მომუშავე wrapper — ეს გამოვა ყველა კონტროლერიდან
function awardXp(db, userId, xpAmount) {
	const user = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId);

	if (!user) {
		throw new Error(`User ${userId} not found`);
	}

	const { newXp, newLevel, leveledUp } = applyXpGain(user.xp, user.level, xpAmount);

	db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?')
		.run(newXp, newLevel, userId);

	return { newXp, newLevel, leveledUp };
}

module.exports = { applyXpGain, awardXp };