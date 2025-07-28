import express from 'express';
import { getPets } from '../controllers/petController.js';

const router = express.Router();

router.get('/', getPets);

export default router;
