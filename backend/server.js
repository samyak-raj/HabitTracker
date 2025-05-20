import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import { clerkMiddleware } from '@clerk/express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import userRoutes from './routes/userRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

// Middleware

app.use('/api/webhook', webhookRoutes); 
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express.json());
// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

// Apply Clerk middleware to all routes except webhook
app.use((req, res, next) => {
    if (req.path === '/api/webhook') {
        next();
    } else {
        clerkMiddleware()(req, res, next);
    }
});

if (!process.env.CLERK_SECRET_KEY) {
    console.error('CLERK_SECRET_KEY is not set in environment variables');
    process.exit(1);
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});