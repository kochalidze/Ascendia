const jwt = require('jsonwebtoken');
const getJWTSecret = () => process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;

	const jwtSecret = getJWTSecret();
	if (!token) {
		return res.status(401).json({ message: "თქვენ არ ხართ ავტორიზებული" });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded;
		next();
	}catch (error) {
		res.status(401).json({ message: "არასწორი ტოკენი" });
	}
} 

const adminMiddleware = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: "თქვენ არ გაქვთ წვდომა ამ რესურსზე" });
	}
	next();
}; 

module.exports = { 
	authMiddleware, 
	adminMiddleware 
};