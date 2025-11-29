// src/controllers/auth.controller.js

import { getFirebaseAuth } from '../libs/firebaseAdmin.js';
import { findOrCreateUser, USER_COLLECTION } from '../models/user.model.js';
import { getDb } from '../libs/mongoClient.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.utils.js';
import { encrypt, decrypt } from '../utils/encryption.utils.js';
import { ObjectId } from 'mongodb';

// --- Core Utility: Issue and Save Refresh Token ---
const issueTokensAndSaveRefresh = async (user, fcmToken = null) => {
    // Get userId as string for JWT token generation
    const userId = user._id instanceof ObjectId ? user._id.toString() : user._id.toString();
    
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const db = getDb();
    
    // Build update operations
    // Encrypt refreshToken before storing in database
    const encryptedRefreshToken = encrypt(refreshToken);
    
    const updateOps = {
        $set: { 
            refreshToken: encryptedRefreshToken,
            lastLogin: new Date(),
        }
    };

    if (fcmToken) {
        // Encrypt FCM token before storing
        const encryptedFcmToken = encrypt(fcmToken);
        // Use $addToSet to add the encrypted FCM token if it doesn't already exist
        updateOps.$addToSet = { fcmTokens: encryptedFcmToken };
    }
    
    // Use the original _id if it's an ObjectId, otherwise convert
    const userObjectId = user._id instanceof ObjectId ? user._id : new ObjectId(userId);
    
    try {
        const updateResult = await db.collection(USER_COLLECTION).updateOne(
            { _id: userObjectId },
            updateOps
        );

        // Log if update didn't match any document
        if (updateResult.matchedCount === 0) {
            console.error(`Warning: No user found with _id: ${userId} (${userObjectId}) to update refreshToken`);
        } else if (updateResult.modifiedCount === 0) {
            console.warn(`Warning: User ${userId} found but refreshToken was not modified (may already be the same value)`);
        } else {
            console.log(`Successfully updated refreshToken for user ${userId}`);
        }
    } catch (updateError) {
        console.error(`Error updating refreshToken for user ${userId}:`, updateError);
        throw updateError;
    }

    return { accessToken, refreshToken };
};
// ---------------------------------------------------

export const register = async (req, res) => {
    try {
        const { idToken, username, fcmToken } = req.body;
        
        const auth = getFirebaseAuth();
        const decodedToken = await auth.verifyIdToken(idToken);

        // 1. Find or create user in MongoDB (Handles profile creation)
        // Use username from request, or fallback to Firebase displayName, or email prefix
        const displayName = username || decodedToken.name || decodedToken.email?.split('@')[0] || `user_${decodedToken.uid.substring(0, 8)}`;
        
        const mongoUser = await findOrCreateUser(decodedToken.uid, {
            email: decodedToken.email,
            displayName: displayName, 
            photoURL: decodedToken.picture,
        });

        // 2. Issue JWTs and save Refresh Token
        const tokens = await issueTokensAndSaveRefresh(mongoUser, fcmToken);

        // Fetch updated user (without sensitive data in response)
        const db = getDb();
        const userObjectId = mongoUser._id instanceof ObjectId ? mongoUser._id : new ObjectId(mongoUser._id.toString());
        const updatedUser = await db.collection(USER_COLLECTION).findOne({ 
            _id: userObjectId
        });

        // Remove sensitive encrypted data from response
        if (updatedUser) {
            delete updatedUser.refreshToken; // Don't send encrypted token to client
        }
        if (mongoUser) {
            delete mongoUser.refreshToken;
        }

        res.status(201).json({ 
            user: updatedUser || mongoUser, 
            ...tokens, 
            message: 'Registration successful.' 
        });

    } catch (error) {
        console.error('Registration/Token verification error:', error);
        
        // Handle duplicate email error
        if (error.code === 11000 || error.message?.includes('duplicate key') || error.message?.includes('email')) {
            return res.status(409).json({ 
                message: 'An account with this email already exists. Please sign in instead.',
                error: 'DUPLICATE_EMAIL'
            });
        }
        
        const errorMessage = error.message || 'Registration failed due to invalid token or server error.';
        res.status(401).json({ message: errorMessage, error: error.code });
    }
};

export const login = async (req, res) => {
    try {
        const { idToken, fcmToken } = req.body;
        
        const auth = getFirebaseAuth();
        const decodedToken = await auth.verifyIdToken(idToken);
        
        // 1. Find or create user in MongoDB (ensures user record is up-to-date)
        const mongoUser = await findOrCreateUser(decodedToken.uid, {
            email: decodedToken.email,
            displayName: decodedToken.name, 
            photoURL: decodedToken.picture,
        });
        
        // 2. Issue JWTs and save Refresh Token
        const tokens = await issueTokensAndSaveRefresh(mongoUser, fcmToken);

        // Fetch updated user (without sensitive data in response)
        const db = getDb();
        const userObjectId = mongoUser._id instanceof ObjectId ? mongoUser._id : new ObjectId(mongoUser._id.toString());
        const updatedUser = await db.collection(USER_COLLECTION).findOne({ 
            _id: userObjectId
        });

        // Remove sensitive encrypted data from response
        if (updatedUser) {
            delete updatedUser.refreshToken; // Don't send encrypted token to client
        }
        if (mongoUser) {
            delete mongoUser.refreshToken;
        }

        res.json({ 
            user: updatedUser || mongoUser, 
            ...tokens, 
            message: 'Login successful.' 
        });

    } catch (error) {
        console.error('Login/Token verification error:', error);
        const errorMessage = error.message || 'Login failed: Invalid token or server error.';
        res.status(401).json({ message: errorMessage, error: error.code });
    }
};

export const socialAuth = async (req, res) => {
    // Social login uses the same underlying token flow as email/password login
    await login(req, res);
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    const payload = verifyRefreshToken(refreshToken);

    if (payload.error) {
        return res.status(403).json({ message: 'Invalid or expired refresh token. Please log in again.' });
    }

    try {
        const db = getDb();
        const userId = payload.userId;

        // 1. Find user and verify token matches the stored token (session validation)
        const user = await db.collection(USER_COLLECTION).findOne({ 
            _id: new ObjectId(userId)
        });

        if (!user) {
            return res.status(403).json({ message: 'User not found.' });
        }

        // Decrypt stored refreshToken and compare with provided token
        let storedRefreshToken = null;
        try {
            storedRefreshToken = user.refreshToken ? decrypt(user.refreshToken) : null;
        } catch (decryptError) {
            // If decryption fails, token might be in old format or corrupted
            console.error('Error decrypting refreshToken:', decryptError);
            return res.status(403).json({ message: 'Invalid refresh token format.' });
        }

        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Refresh token revoked or session not found.' });
        }

        // 2. Generate a NEW Access Token
        const newAccessToken = generateAccessToken(userId);

        res.json({ accessToken: newAccessToken, message: 'Access token refreshed successfully.' });
        
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ message: 'Internal server error during token refresh.' });
    }
};

export const logout = async (req, res) => {
    const { fcmToken } = req.body;
    const userId = req.userId; // Provided by authMiddleware
    const firebaseUid = req.user.firebaseUid; // Provided by authMiddleware

    try {
        const db = getDb();

        const updates = { $set: { refreshToken: null } }; // Revoke the refresh token

        if (fcmToken) {
            // Encrypt FCM token to match the encrypted version in database
            const encryptedFcmToken = encrypt(fcmToken);
            updates.$pull = { fcmTokens: encryptedFcmToken }; // Remove the encrypted FCM token
        }
        
        await db.collection(USER_COLLECTION).updateOne(
            { _id: new ObjectId(userId) },
            updates
        );

        // Revoke Firebase tokens to enforce full logout across all services
        await getFirebaseAuth().revokeRefreshTokens(firebaseUid);

        res.json({ message: 'Logged out successfully. All tokens revoked.' });

    } catch (error) {
        console.warn('Logout warning (token might already be invalid):', error.message);
        res.json({ message: 'Logout process complete.' });
    }
};

export const currentUser = (req, res) => {
    // The user object is attached by authMiddleware (already sanitized)
    // Ensure no sensitive data is exposed
    const userResponse = { ...req.user };
    delete userResponse.refreshToken; // Extra safety - remove if somehow present
    res.json(userResponse);
};

export const completeTutorial = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.user._id;

        await db.collection(USER_COLLECTION).updateOne(
            { _id: userId },
            { $set: { tutorialCompleted: true } }
        );

        res.json({ message: 'Tutorial completed successfully.' });
    } catch (error) {
        console.error('Error completing tutorial:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};