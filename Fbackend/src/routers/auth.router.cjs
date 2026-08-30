const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller.cjs');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware.cjs');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;
