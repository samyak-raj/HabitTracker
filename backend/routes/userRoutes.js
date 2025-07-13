import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    googleAuth,
    getCurrentUser,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/auth/google', googleAuth);

// Protected routes
router.get('/me', requireAuth, getCurrentUser);
router.get('/:id', requireAuth, getUserById);
router.put('/me', upload.single('profilePicture'), requireAuth, updateUser);
router.delete('/me', requireAuth, deleteUser);

export default router; 