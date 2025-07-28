import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth authentication
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Google token is required' });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        // Ensure we extract values properly and convert to strings
        const googleId = String(payload.sub);
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        // Remove size parameters from Google profile picture URL
        const highResPicture = picture ? picture.replace(/=s\d+-c$/, '') : null;

        // 1. Try to find user by googleId (now properly as a string)
        let user = await User.findOne({ googleId: googleId });

        // 2. If not found, try to find by email
        if (!user) {
            user = await User.findOne({ email: email });
            if (user) {
                // Update the user to add googleId and profile picture
                user.googleId = googleId;
                user.profilePicture = highResPicture;
                await user.save();
            }
        }

        // 3. If still not found, create a new user
        if (!user) {
            let username = name || email.split('@')[0];

            // Check if username already exists to avoid conflicts
            const existingUsername = await User.findOne({ username: username });
            if (existingUsername) {
                username = `${username}_${Date.now()}`;
            }

            user = new User({
                googleId: googleId,
                email: email,
                username: username,
                profilePicture: highResPicture
            });
            await user.save();
        }

        // Generate JWT token
        const jwtToken = generateToken(user._id);

        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture,
                level: user.level,
                experience: user.experience
            },
            token: jwtToken
        });
    } catch (error) {
        console.error('Google auth error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'field';
            return res.status(409).json({
                error: `A user with this ${field} already exists.`
            });
        }

        // Handle cast errors
        if (error.name === 'CastError') {
            console.error('Cast error details:', error);
            return res.status(400).json({
                error: 'Invalid data format in authentication'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Invalid user data provided'
            });
        }

        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('pets');
        // Streak reset logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        let lastCompleted = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
        if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);
        if (
            !lastCompleted ||
            (lastCompleted.getTime() !== today.getTime() && lastCompleted.getTime() !== yesterday.getTime())
        ) {
            if (user.currentStreak !== 0) {
                user.currentStreak = 0;
                await user.save();
            }
        }
        res.json({
            id: user._id,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            level: user.level,
            experience: user.experience,
            coins: user.coins,
            pets: user.pets,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastCompletedDate: user.lastCompletedDate
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user coins
export const getUserCoins = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ coins: user.coins });
    } catch (error) {
        console.error('Get user coins error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Streak reset logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        let lastCompleted = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
        if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);
        if (
            !lastCompleted ||
            (lastCompleted.getTime() !== today.getTime() && lastCompleted.getTime() !== yesterday.getTime())
        ) {
            if (user.currentStreak !== 0) {
                user.currentStreak = 0;
                await user.save();
            }
        }
        res.json({
            id: user._id,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            level: user.level,
            experience: user.experience,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastCompletedDate: user.lastCompletedDate
        });
    } catch (err) {
        console.error('Error in getUserById:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            updateData.profilePicture = `/profile-pics/${req.file.filename}`;
        }
        // Only allow updating currentStreak unless longestStreak is explicitly provided
        if (!('longestStreak' in updateData)) {
            delete updateData.longestStreak;
        }
        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            level: user.level,
            experience: user.experience,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastCompletedDate: user.lastCompletedDate
        });
    } catch (err) {
        console.error('Error in updateUser:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error in deleteUser:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 