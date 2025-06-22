import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    googleAuth,
    getCurrentUser,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/auth/google', googleAuth);

// Protected routes
router.get('/me', requireAuth, getCurrentUser);
router.get('/:id', requireAuth, getUserById);
router.put('/me', requireAuth, updateUser);
router.delete('/me', requireAuth, deleteUser);

export default router; 