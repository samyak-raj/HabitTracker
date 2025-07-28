import express from 'express';
import { addPet, getPets, updatePet, deletePet } from '../controllers/petController.js';

const router = express.Router();

router.get('/', getPets);
router.post('/', addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
