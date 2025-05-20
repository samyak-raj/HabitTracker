import User from '../models/User.js';
import { users } from '@clerk/clerk-sdk-node';

// Create a new user
export const createUser = async (req, res) => {
    try {
        console.log('createUser controller called');
        console.log('Auth data:', req.auth);

        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(400).json({ error: 'No userId found in auth data.' });
        }

        // Fetch user details from Clerk
        const clerkUser = await users.getUser(clerkId);

        const emailAddresses = clerkUser.emailAddresses;
        const username = clerkUser.username;

        if (!emailAddresses || !emailAddresses.length) {
            console.log('No email addresses found in Clerk user');
            return res.status(400).json({ error: 'No email address found for this user.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
            console.log('Existing user found:', existingUser);
            return res.status(200).json(existingUser);
        }

        // Create new user
        const user = new User({
            clerkId,
            email: emailAddresses[0].emailAddress,
            username: username || emailAddresses[0].emailAddress.split('@')[0],
        });

        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error('Error in createUser:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a user by ID
export const getUserById = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(401).json({ error: 'Unauthorized: No userId in auth.' });
        }
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error in getUserById:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(401).json({ error: 'Unauthorized: No userId in auth.' });
        }
        const user = await User.findOneAndUpdate({ clerkId }, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error in updateUser:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(401).json({ error: 'Unauthorized: No userId in auth.' });
        }
        const user = await User.findOneAndDelete({ clerkId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error in deleteUser:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 