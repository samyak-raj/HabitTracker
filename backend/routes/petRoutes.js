import express from 'express';
import { addPet, getPets, updatePet, deletePet, buyPet } from '../controllers/petController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPets);
router.post('/', addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);
router.post('/buy', requireAuth, buyPet);

export default router;
