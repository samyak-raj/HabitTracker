import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// User routes
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 