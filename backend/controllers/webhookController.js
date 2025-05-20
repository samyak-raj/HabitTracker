import { Webhook } from 'svix';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

export const handleWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Get the headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Error occured -- no svix headers' });
    }

    // Get the body
    let payload;
    
    if (Buffer.isBuffer(req.body)) {
        // If body is already a Buffer (using express.raw middleware)
        payload = req.body.toString('utf8');
    } else if (typeof req.body === 'string') {
        // If body is already a string
        payload = req.body;
    } else {
        // If body is parsed as JSON object
        payload = JSON.stringify(req.body);
    }

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        console.error('Headers:', { svix_id, svix_timestamp, svix_signature });
        console.error('Payload type:', typeof payload);
        console.error('Payload length:', payload.length);
        // Don't log the full payload as it may contain sensitive info
        return res.status(400).json({ error: 'Error verifying signature' });
    }
    // Handle the webhook
    const eventType = evt.type;
    console.log(`Webhook event received: ${eventType}`);

    try {
        switch (eventType) {
            case 'user.created':
                await handleUserCreated(evt.data);
                break;
            case 'user.updated':
                await handleUserUpdated(evt.data);
                break;
            case 'user.deleted':
                await handleUserDeleted(evt.data);
                break;
            default:
                console.log(`Unhandled webhook event type: ${eventType}`);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(`Error handling ${eventType} webhook:`, err);
        res.status(500).json({ error: `Error handling ${eventType} event` });
    }
};

// Handle user.created event
async function handleUserCreated(data) {
    const { id, username, email_addresses } = data;
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: id });
    if (existingUser) {
        console.log('User already exists in database:', existingUser);
        return;
    }
    
    // Make sure we have an email
    if (!email_addresses || !email_addresses.length) {
        console.log('No email addresses found for user:', id);
        return;
    }
    
    // Create new user in MongoDB
    const newUser = new User({
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username || email_addresses[0].email_address.split('@')[0],
        // Add default values for your gamification system
        level: 1,
        xp: 0,
        // Any other default fields for your user
    });
    
    await newUser.save();
    console.log('New user created in database:', newUser);
}

// Handle user.updated event
async function handleUserUpdated(data) {
    const { id, username, email_addresses } = data;
    
    const user = await User.findOne({ clerkId: id });
    if (!user) {
        console.log('User not found for update. Creating new user.');
        // If user doesn't exist, create them
        return await handleUserCreated(data);
    }
    
    // Update user properties
    if (email_addresses && email_addresses.length) {
        user.email = email_addresses[0].email_address;
    }
    
    if (username) {
        user.username = username;
    } else if (email_addresses && email_addresses.length && !user.username) {
        user.username = email_addresses[0].email_address.split('@')[0];
    }
    
    await user.save();
    console.log('User updated in database:', user);
}

// Handle user.deleted event
async function handleUserDeleted(data) {
    const { id } = data;
    
    const user = await User.findOneAndDelete({ clerkId: id });
    if (user) {
        console.log('User deleted from database:', user);
    } else {
        console.log('User not found for deletion:', id);
    }
}