import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook endpoint - no auth required as it's called by Clerk
router.post('/', express.raw({ type: 'application/json' }), handleWebhook);

export default router;