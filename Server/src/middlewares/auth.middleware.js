// src/middlewares/auth.middleware.js

import { verifyAccessToken } from '../utils/token.utils.js';
import { getDb } from '../libs/mongoClient.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token required (Bearer scheme).' });
    }

    const accessToken = authHeader.split(' ')[1];

    // 1. Verify the Access Token
    const payload = verifyAccessToken(accessToken);

    if (payload.error === 'TokenExpiredError') {
        return res.status(401).json({ 
            message: 'Access Token expired. Use refresh token to renew.', 
            expired: true 
        });
    }

    if (payload.error || !payload.userId) {
        return res.status(403).json({ message: 'Invalid or malformed access token.' });
    }

    try {
        const db = getDb();
        
        // 2. Fetch the user from MongoDB
        const user = await db.collection(USER_COLLECTION).findOne({ 
            _id: new ObjectId(payload.userId) 
        });

        if (!user) {
            return res.status(404).json({ message: 'Authenticated user not found in database.' });
        }

        // 3. Remove sensitive encrypted data before attaching to request
        // (Controllers shouldn't need to access encrypted tokens)
        const sanitizedUser = { ...user };
        delete sanitizedUser.refreshToken; // Remove encrypted refreshToken
        // Note: fcmTokens remain encrypted in DB but can be decrypted if needed
        
        // 4. Attach user data to the request for controllers
        req.user = sanitizedUser;
        req.userId = sanitizedUser._id.toString(); // Store string ID for convenience
        
        next();
    } catch (error) {
        console.error('Database lookup error in authMiddleware:', error);
        return res.status(500).json({ message: 'Server authentication processing error.' });
    }
};

export default authMiddleware;