const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, getTopUsers, updateUserProfile, deleteUser } = require('../controllers/users.controller.cjs');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware.cjs');

router.get('/get-all', authMiddleware, getAllUsers);
router.get('/get/:id', authMiddleware, getUserById);
router.get('/get-top-users', authMiddleware, getTopUsers);
router.put('/update/:id', authMiddleware, updateUserProfile);
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;