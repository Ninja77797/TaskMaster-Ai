import express from 'express';
import {
	register,
	login,
	getMe,
	updateMe,
	deleteMe,
	uploadAvatarController,
	googleAuthRedirect,
	googleAuthCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);
router.post('/avatar', protect, uploadAvatar.single('avatar'), uploadAvatarController);

export default router;
