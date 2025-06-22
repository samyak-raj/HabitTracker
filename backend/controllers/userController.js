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
        const { sub: googleId, email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ googleId });

        if (!user) {
            // Create new user
            user = new User({
                googleId,
                email,
                username: name || email.split('@')[0],
                profilePicture: picture
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
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            id: user._id,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            level: user.level,
            experience: user.experience
        });
    } catch (error) {
        console.error('Get current user error:', error);
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
        res.json({
            id: user._id,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            level: user.level,
            experience: user.experience
        });
    } catch (err) {
        console.error('Error in getUserById:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            level: user.level,
            experience: user.experience
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